package edu.ssw590.summitwealthbank.service;

import edu.ssw590.summitwealthbank.dto.TransferRequest;
import edu.ssw590.summitwealthbank.model.Account;
import edu.ssw590.summitwealthbank.model.Transaction;
import edu.ssw590.summitwealthbank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<Transaction> getRecentTransactionsByEmail(String email, int limit) {
        List<Account> accounts = accountService.getAccountsByEmail(email);

        if (accounts.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> accountIds = accounts.stream()
                .map(Account::getId)
                .collect(Collectors.toList());

        return transactionRepository.findRecentByAccountIds(accountIds, PageRequest.of(0, limit));
    }
}