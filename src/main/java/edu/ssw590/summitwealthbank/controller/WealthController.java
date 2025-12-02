package edu.ssw590.summitwealthbank.controller;

import edu.ssw590.summitwealthbank.dto.RiskScoreRequest;
import edu.ssw590.summitwealthbank.dto.WealthActionRequest;
import edu.ssw590.summitwealthbank.model.WealthPortfolio;
import edu.ssw590.summitwealthbank.service.WealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wealth")
@RequiredArgsConstructor
@CrossOrigin
public class WealthController {

    private final WealthService wealthService;

    @GetMapping
    public List<WealthPortfolio> getPortfolios(Authentication authentication) {
        String email = authentication.getName();
        return wealthService.getPortfoliosByEmail(email);
    }

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

    @PostMapping("/invest")
    public WealthPortfolio invest(@RequestBody WealthActionRequest request, Authentication authentication) {
        String email = authentication.getName();
        return wealthService.buy(request);
    }
}