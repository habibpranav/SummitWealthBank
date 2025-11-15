package edu.ssw590.summitwealthbank.service;

import edu.ssw590.summitwealthbank.dto.TransferRequest;
import edu.ssw590.summitwealthbank.model.Account;
import edu.ssw590.summitwealthbank.model.Transaction;
import edu.ssw590.summitwealthbank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferService {

    private final AccountService accountService;
    private final TransactionRepository transactionRepository;

    public Transaction transfer(TransferRequest request) {
        Account from = accountService.getAccount(request.getFromAccountId());
        Account to = accountService.getAccount(request.getToAccountId());

        if (from.isFrozen() || to.isFrozen()) {
            throw new IllegalStateException("One or both accounts are frozen");
        }

        if (from.getBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }

        from.setBalance(from.getBalance().subtract(request.getAmount()));
        to.setBalance(to.getBalance().add(request.getAmount()));

        accountService.saveAccount(from);
        accountService.saveAccount(to);

        Transaction tx = Transaction.builder()
                .fromAccountId(from.getId())
                .toAccountId(to.getId())
                .amount(request.getAmount())
                .timestamp(LocalDateTime.now())
                .build();

        return transactionRepository.save(tx);
    }

    public List<Transaction> getTransactions(Long accountId) {
        return transactionRepository.findByFromAccountIdOrToAccountId(accountId, accountId);
    }
}