package main

import (
	"fmt"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

var (
	// based on the assumption that we have 1 block per 5 seconds
	denom     = "acudos"         // Hardcoded to the acudos currency. Its not changeable, because some of the math depends on the size of this denomination
	totalDays = sdk.NewInt(3652) // Hardcoded to 10 years
	// InitialNormTimePassed = sdk.NewDecWithPrec(9678829209, 10)
	InitialNormTimePassed = sdk.NewDecWithPrec(53172694105988, 14)
	FinalNormTimePassed   = sdk.NewDec(10)
	zeroPointSix          = sdk.MustNewDecFromStr("0.6")
	twentySixPointFive    = sdk.MustNewDecFromStr("26.5")
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

// func calculateIntegralInNorm(t sdk.Dec) sdk.Dec {
// 	if t.LT(InitialNormTimePassed) {
// 		return sdk.NewDec(0)
// 	}

// 	if t.GT(FinalNormTimePassed) {
// 		return calculateIntegral(FinalNormTimePassed)
// 	}

// 	integralUpperbound := calculateIntegral(t)
// 	integralLowerbound := calculateIntegral(InitialNormTimePassed)
// 	return integralUpperbound.Sub(integralLowerbound)
// }

func calculateMintedCoins(normTimePassed sdk.Dec, increment sdk.Dec) sdk.Dec {
	prevStep := calculateIntegral(sdk.MinDec(normTimePassed, FinalNormTimePassed))
	nextStep := calculateIntegral(sdk.MinDec(normTimePassed.Add(increment), FinalNormTimePassed))
	return (nextStep.Sub(prevStep)).Mul(sdk.NewDec(10).Power(24)) // formula calculates in mil of cudos + converting to acudos
}

func main() {
	fmt.Println(InitialNormTimePassed)
	minted := sdk.NewDec(0)
	i := 0
	incr := normalizeBlockHeightInc(sdk.NewInt(17280))

	fmt.Println("Integrate 0: " + calculateIntegral(sdk.NewDec(0)).Mul(sdk.NewDec(10).Power(24)).String())
	fmt.Println("Integrate Initial: " + calculateIntegral(InitialNormTimePassed).Mul(sdk.NewDec(10).Power(24)).String())
	fmt.Println("Integrate Final: " + calculateIntegral(FinalNormTimePassed).Mul(sdk.NewDec(10).Power(24)).String())
	fmt.Println("Integrate Final+: " + calculateIntegral(sdk.NewDecWithPrec(102, 1)).Mul(sdk.NewDec(10).Power(24)).String())

	for normTimePassed := InitialNormTimePassed; ; {
		i += 1

		if (i % 144000) == 0 {
			fmt.Println("i: " + strconv.Itoa(i) + " Norm time passed: " + normTimePassed.String())
			fmt.Println("Minted so far: " + minted.String())
		}

		if normTimePassed.GT(sdk.NewDecWithPrec(102, 1)) {
			fmt.Println("end time:" + normTimePassed.String())
			break
		}

		mintAmountDec := calculateMintedCoins(normTimePassed, incr)
		mintAmountInt := mintAmountDec.TruncateInt()
		minted = minted.Add(mintAmountInt.ToDec())
		mintRemainder := mintAmountDec.Sub(mintAmountInt.ToDec())
		if mintRemainder.GT(sdk.NewDec(0)) {
			panic(mintRemainder)
		}

		normTimePassed = normTimePassed.Add(incr)

		if i == 1 {
			fmt.Println("Minted after first block: " + minted.String())
		}
	}
	fmt.Println("Minted tokens: " + minted.String())
}
