package edu.ssw590.summitwealthbank.service;

import edu.ssw590.summitwealthbank.model.Account;
import edu.ssw590.summitwealthbank.model.CardTransaction;
import edu.ssw590.summitwealthbank.repository.CardTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardFeedService {

    private final CardTransactionRepository cardTransactionRepository;
    private final AccountService accountService;

    private static final String[] TRUSTED_MERCHANTS = {
            "Amazon", "Starbucks", "Walmart", "Apple", "Target"
    };

    private static final String[] RANDOM_MERCHANTS = {
            "Amazon", "Starbucks", "Walmart", "Apple", "Target",
            "Suspicious Crypto Exchange", "Weird Gift Shop", "TotallyNotAScam Inc"
    };

    private final Random random = new Random();

    public void generateTransaction(Long accountId) {
        String merchant = RANDOM_MERCHANTS[random.nextInt(RANDOM_MERCHANTS.length)];
        BigDecimal amount = BigDecimal.valueOf(50 + random.nextInt(1000));
        boolean isTrusted = List.of(TRUSTED_MERCHANTS).contains(merchant);
        boolean flagged = !isTrusted && amount.compareTo(BigDecimal.valueOf(500)) > 0;

        CardTransaction tx = CardTransaction.builder()
                .accountId(accountId)
                .merchant(merchant)
                .amount(amount)
                .timestamp(LocalDateTime.now())
                .flaggedFraud(flagged)
                .build();

        cardTransactionRepository.save(tx);
    }

    public List<CardTransaction> getTransactions(Long accountId) {
        return cardTransactionRepository.findByAccountId(accountId);
    }

    public List<CardTransaction> getTransactionsByEmail(String email) {
        List<Account> accounts = accountService.getAccountsByEmail(email);

        if (accounts.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> accountIds = accounts.stream()
                .map(Account::getId)
                .collect(Collectors.toList());

        return cardTransactionRepository.findByAccountIdInOrderByTimestampDesc(accountIds);
    }
}