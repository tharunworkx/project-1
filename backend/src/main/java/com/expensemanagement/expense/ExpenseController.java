package com.expensemanagement.expense;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(expenseRepository.findByStatus(status.toUpperCase().trim()));
        }
        return ResponseEntity.ok(expenseRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return expenseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense, Principal principal) {
        if (expense.getStatus() == null || expense.getStatus().isBlank()) {
            expense.setStatus("PENDING");
        }
        if ((expense.getSubmittedBy() == null || expense.getSubmittedBy().isBlank()) && principal != null) {
            expense.setSubmittedBy(principal.getName());
        }
        Expense saved = expenseRepository.save(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense updated) {
        return expenseRepository.findById(id)
                .map(existing -> {
                    if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
                    if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
                    if (updated.getAmount() != null) existing.setAmount(updated.getAmount());
                    if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
                    if (updated.getDepartment() != null) existing.setDepartment(updated.getDepartment());
                    if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
                    if (updated.getReceiptUrl() != null) existing.setReceiptUrl(updated.getReceiptUrl());
                    return ResponseEntity.ok(expenseRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Admin')")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'FINANCE_EXECUTIVE', 'FINANCE_MANAGER___CFO') or hasAnyAuthority('Admin', 'Manager', 'Finance Executive', 'Finance Manager / CFO')")
    public ResponseEntity<Expense> approveExpense(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body, Principal principal) {
        return expenseRepository.findById(id)
                .map(expense -> {
                    expense.setStatus("APPROVED");
                    if (body != null && body.containsKey("approver")) {
                        expense.setApprovedBy(body.get("approver"));
                    } else if (principal != null) {
                        expense.setApprovedBy(principal.getName());
                    }
                    return ResponseEntity.ok(expenseRepository.save(expense));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'FINANCE_EXECUTIVE', 'FINANCE_MANAGER___CFO') or hasAnyAuthority('Admin', 'Manager', 'Finance Executive', 'Finance Manager / CFO')")
    public ResponseEntity<Expense> rejectExpense(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return expenseRepository.findById(id)
                .map(expense -> {
                    expense.setStatus("REJECTED");
                    return ResponseEntity.ok(expenseRepository.save(expense));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reimburse")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'FINANCE_EXECUTIVE', 'FINANCE_MANAGER___CFO') or hasAnyAuthority('Admin', 'Manager', 'Finance Executive', 'Finance Manager / CFO')")
    public ResponseEntity<Expense> reimburseExpense(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return expenseRepository.findById(id)
                .map(expense -> {
                    expense.setStatus("REIMBURSED");
                    return ResponseEntity.ok(expenseRepository.save(expense));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/batch-reimburse")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'FINANCE_EXECUTIVE', 'FINANCE_MANAGER___CFO') or hasAnyAuthority('Admin', 'Manager', 'Finance Executive', 'Finance Manager / CFO')")
    public ResponseEntity<List<Expense>> batchReimburse(@RequestBody Map<String, List<Long>> payload) {
        List<Long> ids = payload.get("ids");
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<Expense> expenses = expenseRepository.findAllById(ids);
        for (Expense e : expenses) {
            e.setStatus("REIMBURSED");
        }
        return ResponseEntity.ok(expenseRepository.saveAll(expenses));
    }
}
