package app.web;

import app.security.UserData;
import app.transaction.model.Transaction;
import app.transaction.service.TransactionService;
import app.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final WalletService walletService;

    @Autowired
    public TransactionController(TransactionService transactionService, WalletService walletService) {
        this.transactionService = transactionService;
        this.walletService = walletService;
    }

    @GetMapping
    public ModelAndView getTransactionHistory(@AuthenticationPrincipal UserData userData) {


        List<Transaction> allUserTransactions = transactionService.getAllByUserId(userData.getUserId());

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("transactions");
        modelAndView.addObject("transactions", allUserTransactions);

        return modelAndView;
    }

    @GetMapping("/{id}")
    public ModelAndView getTransaction(@PathVariable UUID id) {

        Transaction transaction = transactionService.getById(id);

        var wallet = walletService.getWalletByTransaction(transaction);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("transaction-result");
        modelAndView.addObject("transaction", transaction);
        modelAndView.addObject("wallet", wallet);


        return modelAndView;
    }
}
