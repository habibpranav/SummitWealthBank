package edu.ssw590.summitwealthbank.service;

import edu.ssw590.summitwealthbank.dto.RiskScoreRequest;
import edu.ssw590.summitwealthbank.dto.StockPortfolioResponse;
import edu.ssw590.summitwealthbank.dto.TotalWealthResponse;
import edu.ssw590.summitwealthbank.dto.WealthActionRequest;
import edu.ssw590.summitwealthbank.model.Account;
import edu.ssw590.summitwealthbank.model.WealthPortfolio;
import edu.ssw590.summitwealthbank.repository.WealthPortfolioRepository;
import edu.ssw590.summitwealthbank.util.ETFPriceSimulator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WealthService {

    private final AccountService accountService;
    private final WealthPortfolioRepository wealthPortfolioRepository;
    private final StockService stockService;

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

        p.setStockUnits(p.getStockUnits().add(stockAmount.divide(stockPrice, 4, RoundingMode.HALF_UP)));
        p.setBondUnits(p.getBondUnits().add(bondAmount.divide(bondPrice, 4, RoundingMode.HALF_UP)));

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

        BigDecimal sellRatio = req.getAmount().divide(totalValue, 4, RoundingMode.HALF_UP);

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

        return stockValue.add(bondValue).setScale(2, RoundingMode.HALF_UP);
    }

    public List<WealthPortfolio> getPortfoliosByEmail(String email) {
        List<Account> accounts = accountService.getAccountsByEmail(email);

        if (accounts.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> accountIds = accounts.stream()
                .map(Account::getId)
                .collect(Collectors.toList());

        return accountIds.stream()
                .map(accountId -> wealthPortfolioRepository.findByAccountId(accountId).orElse(null))
                .filter(portfolio -> portfolio != null)
                .collect(Collectors.toList());
    }

    public TotalWealthResponse getTotalWealth(String email) {
        // Get all accounts
        List<Account> accounts = accountService.getAccountsByEmail(email);

        // Calculate account balances by type
        BigDecimal checkingBalance = accounts.stream()
                .filter(acc -> acc.getType() == Account.AccountType.CHECKING)
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal savingsBalance = accounts.stream()
                .filter(acc -> acc.getType() == Account.AccountType.SAVINGS)
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get stock portfolio value
        List<StockPortfolioResponse> stockPortfolio = stockService.getUserPortfolio(email);
        BigDecimal stockPortfolioValue = stockPortfolio.stream()
                .map(StockPortfolioResponse::getMarketValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate total wealth
        BigDecimal totalWealth = checkingBalance
                .add(savingsBalance)
                .add(stockPortfolioValue)
                .setScale(2, RoundingMode.HALF_UP);

        return TotalWealthResponse.builder()
                .checkingBalance(checkingBalance.setScale(2, RoundingMode.HALF_UP))
                .savingsBalance(savingsBalance.setScale(2, RoundingMode.HALF_UP))
                .stockPortfolioValue(stockPortfolioValue.setScale(2, RoundingMode.HALF_UP))
                .totalWealth(totalWealth)
                .build();
    }
}