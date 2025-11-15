package edu.ssw590.summitwealthbank.service;

import edu.ssw590.summitwealthbank.dto.AdminActionRequest;
import edu.ssw590.summitwealthbank.model.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AccountService accountService;

    public void freezeAccount(AdminActionRequest request) {
        Account account = accountService.getAccount(request.getAccountId());
        account.setFrozen(true);
        accountService.saveAccount(account);
    }

    public void unfreezeAccount(AdminActionRequest request) {
        Account account = accountService.getAccount(request.getAccountId());
        account.setFrozen(false);
        accountService.saveAccount(account);
    }
}