package edu.ssw590.summitwealthbank.controller;

import edu.ssw590.summitwealthbank.dto.TransferRequest;
import edu.ssw590.summitwealthbank.model.Transaction;
import edu.ssw590.summitwealthbank.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfer")
@RequiredArgsConstructor
@CrossOrigin
public class TransferController {

    private final TransferService transferService;

    @PostMapping
    public Transaction transfer(@RequestBody TransferRequest request) {
        return transferService.transfer(request);
    }

    @GetMapping("/{accountId}")
    public List<Transaction> getTransactions(@PathVariable Long accountId) {
        return transferService.getTransactions(accountId);
    }
}