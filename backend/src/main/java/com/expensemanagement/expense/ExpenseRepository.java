package com.expensemanagement.expense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findBySubmittedBy(String submittedBy);
    List<Expense> findByDepartment(String department);
    List<Expense> findByStatus(String status);
}

