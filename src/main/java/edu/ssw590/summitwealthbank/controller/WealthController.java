package edu.ssw590.summitwealthbank.controller;

import edu.ssw590.summitwealthbank.dto.RiskScoreRequest;
import edu.ssw590.summitwealthbank.dto.WealthActionRequest;
import edu.ssw590.summitwealthbank.model.WealthPortfolio;
import edu.ssw590.summitwealthbank.service.WealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wealth")
@RequiredArgsConstructor
@CrossOrigin
public class WealthController {

    private final WealthService wealthService;

    @PostMapping("/risk")
    public WealthPortfolio setRisk(@RequestBody RiskScoreRequest request) {
        return wealthService.setRiskScore(request);
    }

    @PostMapping("/buy")
    public WealthPortfolio buy(@RequestBody WealthActionRequest request) {
        return wealthService.buy(request);
    }

    @PostMapping("/sell")
    public WealthPortfolio sell(@RequestBody WealthActionRequest request) {
        return wealthService.sell(request);
    }

    @GetMapping("/value/{accountId}")
    public BigDecimal getValue(@PathVariable Long accountId) {
        return wealthService.getPortfolioValue(accountId);
    }
}