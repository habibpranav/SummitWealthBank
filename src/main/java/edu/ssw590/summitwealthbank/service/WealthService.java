package edu.ssw590.summitwealthbank.service;

import edu.ssw590.summitwealthbank.dto.RiskScoreRequest;
import edu.ssw590.summitwealthbank.dto.WealthActionRequest;
import edu.ssw590.summitwealthbank.model.Account;
import edu.ssw590.summitwealthbank.model.WealthPortfolio;
import edu.ssw590.summitwealthbank.repository.WealthPortfolioRepository;
import edu.ssw590.summitwealthbank.util.ETFPriceSimulator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WealthService {

    private final AccountService accountService;
    private final WealthPortfolioRepository wealthPortfolioRepository;

    public WealthPortfolio setRiskScore(RiskScoreRequest req) {
        BigDecimal stock = BigDecimal.valueOf(req.getRiskScore() * 20); // 1→20%, 5→100%
        BigDecimal bond = BigDecimal.valueOf(100).subtract(stock);

        WealthPortfolio portfolio = wealthPortfolioRepository
                .findByAccountId(req.getAccountId())
                .orElse(WealthPortfolio.builder()
                        .accountId(req.getAccountId())
                        .stockUnits(BigDecimal.ZERO)
                        .bondUnits(BigDecimal.ZERO)
                        .build());

        portfolio.setStockPercentage(stock);
        portfolio.setBondPercentage(bond);

        return wealthPortfolioRepository.save(portfolio);
    }

    public WealthPortfolio buy(WealthActionRequest req) {
        Account acc = accountService.getAccount(req.getAccountId());

        if (acc.getBalance().compareTo(req.getAmount()) < 0) {
            throw new IllegalArgumentException("Not enough cash");
        }

        WealthPortfolio p = wealthPortfolioRepository.findByAccountId(req.getAccountId())
                .orElseThrow(() -> new IllegalStateException("Portfolio not found"));

        BigDecimal stockPrice = ETFPriceSimulator.getStockPrice();
        BigDecimal bondPrice = ETFPriceSimulator.getBondPrice();

        BigDecimal stockAmount = req.getAmount().multiply(p.getStockPercentage()).divide(BigDecimal.valueOf(100));
        BigDecimal bondAmount = req.getAmount().multiply(p.getBondPercentage()).divide(BigDecimal.valueOf(100));

        p.setStockUnits(p.getStockUnits().add(stockAmount.divide(stockPrice, 4, BigDecimal.ROUND_HALF_UP)));
        p.setBondUnits(p.getBondUnits().add(bondAmount.divide(bondPrice, 4, BigDecimal.ROUND_HALF_UP)));

        acc.setBalance(acc.getBalance().subtract(req.getAmount()));
        accountService.saveAccount(acc);

        return wealthPortfolioRepository.save(p);
    }

    public WealthPortfolio sell(WealthActionRequest req) {
        Account acc = accountService.getAccount(req.getAccountId());

        WealthPortfolio p = wealthPortfolioRepository.findByAccountId(req.getAccountId())
                .orElseThrow(() -> new IllegalStateException("Portfolio not found"));

        BigDecimal stockPrice = ETFPriceSimulator.getStockPrice();
        BigDecimal bondPrice = ETFPriceSimulator.getBondPrice();

        BigDecimal stockValue = p.getStockUnits().multiply(stockPrice);
        BigDecimal bondValue = p.getBondUnits().multiply(bondPrice);

        BigDecimal totalValue = stockValue.add(bondValue);
        if (req.getAmount().compareTo(totalValue) > 0) {
            throw new IllegalArgumentException("Not enough assets");
        }

        BigDecimal sellRatio = req.getAmount().divide(totalValue, 4, BigDecimal.ROUND_HALF_UP);

        p.setStockUnits(p.getStockUnits().multiply(BigDecimal.ONE.subtract(sellRatio)));
        p.setBondUnits(p.getBondUnits().multiply(BigDecimal.ONE.subtract(sellRatio)));

        acc.setBalance(acc.getBalance().add(req.getAmount()));
        accountService.saveAccount(acc);

        return wealthPortfolioRepository.save(p);
    }

    public BigDecimal getPortfolioValue(Long accountId) {
        WealthPortfolio p = wealthPortfolioRepository.findByAccountId(accountId)
                .orElseThrow(() -> new IllegalStateException("Portfolio not found"));

        BigDecimal stockValue = p.getStockUnits().multiply(ETFPriceSimulator.getStockPrice());
        BigDecimal bondValue = p.getBondUnits().multiply(ETFPriceSimulator.getBondPrice());

        return stockValue.add(bondValue).setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}