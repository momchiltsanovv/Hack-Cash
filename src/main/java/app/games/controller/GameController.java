package app.games.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GameController {

    @GetMapping("/memory")
    public String memoryGame() {
        return "/games/memory";
    }

    @GetMapping("/spendquest")
    public String spendQuestGame() {
        return "games/map";
    }
}
