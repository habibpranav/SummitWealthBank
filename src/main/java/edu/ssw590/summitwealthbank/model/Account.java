package edu.ssw590.summitwealthbank.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private AccountType type;

    private BigDecimal balance;

    private boolean frozen;

    @Column(unique = true)
    private String accountNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (accountNumber == null) {
            accountNumber = generateAccountNumber();
        }
    }

    private String generateAccountNumber() {
        // Generate a random 10-digit account number
        return String.format("%010d", (long) (Math.random() * 10000000000L));
    }

    // Add a transient status field based on frozen status
    @Transient
    public String getStatus() {
        return frozen ? "FROZEN" : "ACTIVE";
    }

    public enum AccountType {
        CHECKING,
        SAVINGS
    }
}