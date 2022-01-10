package main

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

var (
	// based on the assumption that we have 1 block per 5 seconds
	denom               = "acudos"         // Hardcoded to the acudos currency. Its not changeable, because some of the math depends on the size of this denomination
	totalDays           = sdk.NewInt(3652) // Hardcoded to 10 years
	FinalNormTimePassed = sdk.NewDec(10)
	zeroPointSix        = sdk.MustNewDecFromStr("0.6")
	twentySixPointFive  = sdk.MustNewDecFromStr("26.5")
)

// Normalize block height incrementation
func normalizeBlockHeightInc(blocksPerDay sdk.Int) sdk.Dec {
	totalBlocks := blocksPerDay.Mul(totalDays)
	return (sdk.NewDec(1).QuoInt(totalBlocks)).Mul(FinalNormTimePassed)
}

// Integral of f(t) is 0,6 * t^3  - 26.5 * t^2 + 358 * t
func calculateIntegral(t sdk.Dec) sdk.Dec {
	return (zeroPointSix.Mul(t.Power(3))).Sub(twentySixPointFive.Mul(t.Power(2))).Add(sdk.NewDec(358).Mul(t))
}

func calculateMintedCoins(normTimePassed sdk.Dec, increment sdk.Dec) sdk.Dec {
	prevStep := calculateIntegral(sdk.MinDec(normTimePassed, FinalNormTimePassed))
	nextStep := calculateIntegral(sdk.MinDec(normTimePassed.Add(increment), FinalNormTimePassed))
	return (nextStep.Sub(prevStep)).Mul(sdk.NewDec(10).Power(24)) // formula calculates in mil of cudos + converting to acudos
}

func main() {
	minted := sdk.NewDec(0)
	i := 0
	for normTimePassed := sdk.NewDec(0); ; {
		i += 1

		if (i % 144000) == 0 {
			fmt.Println(i)
			fmt.Println(normTimePassed)
		}

		if normTimePassed.GT(sdk.NewDec(11)) {
			fmt.Print("end time:")
			fmt.Println(normTimePassed)
			break
		}

		incr := normalizeBlockHeightInc(sdk.NewInt(14400))
		mintAmountDec := calculateMintedCoins(normTimePassed, incr)
		mintAmountInt := mintAmountDec.TruncateInt()
		minted = minted.Add(mintAmountInt.ToDec())
		mintRemainder := mintAmountDec.Sub(mintAmountInt.ToDec())
		if mintRemainder.GT(sdk.NewDec(0)) {
			panic(mintRemainder)
		}

		normTimePassed = normTimePassed.Add(incr)
	}
	fmt.Print("Minted tokens:")
	fmt.Println(minted)
}

// 0.000000190154557620
