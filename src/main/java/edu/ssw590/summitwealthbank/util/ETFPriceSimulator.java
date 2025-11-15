package edu.ssw590.summitwealthbank.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

public class ETFPriceSimulator {

    private static final Random random = new Random();
    private static BigDecimal stockPrice = BigDecimal.valueOf(100);
    private static BigDecimal bondPrice = BigDecimal.valueOf(100);

    public static BigDecimal getStockPrice() {
        stockPrice = simulateNextPrice(stockPrice);
        return stockPrice;
    }

    public static BigDecimal getBondPrice() {
        bondPrice = simulateNextPrice(bondPrice);
        return bondPrice;
    }

    private static BigDecimal simulateNextPrice(BigDecimal currentPrice) {
        double change = 1 + (random.nextGaussian() * 0.01);
        return currentPrice.multiply(BigDecimal.valueOf(change)).setScale(2, RoundingMode.HALF_UP);
    }
}