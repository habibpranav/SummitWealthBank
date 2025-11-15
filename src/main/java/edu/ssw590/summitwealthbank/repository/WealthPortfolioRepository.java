package edu.ssw590.summitwealthbank.repository;

import edu.ssw590.summitwealthbank.model.WealthPortfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WealthPortfolioRepository extends JpaRepository<WealthPortfolio, Long> {
    Optional<WealthPortfolio> findByAccountId(Long accountId);
}