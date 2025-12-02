package edu.ssw590.summitwealthbank.controller;

import edu.ssw590.summitwealthbank.dto.TransferRequest;
import edu.ssw590.summitwealthbank.model.Transaction;
import edu.ssw590.summitwealthbank.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class TransferController {

    private final TransferService transferService;

    @PostMapping("/api/transfer")
    public Transaction transfer(@RequestBody TransferRequest request) {
        return transferService.transfer(request);
    }

    @GetMapping("/api/transfer/{accountId}")
    public List<Transaction> getTransactions(@PathVariable Long accountId) {
        return transferService.getTransactions(accountId);
    }

    @GetMapping("/api/transactions/recent")
    public List<Transaction> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        String email = authentication.getName();
        return transferService.getRecentTransactionsByEmail(email, limit);
    }
}