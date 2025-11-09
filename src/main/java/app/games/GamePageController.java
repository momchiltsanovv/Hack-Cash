package app.games;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GamePageController {

    @GetMapping("/games")
    public String gamesPage() {
        return "games";
    }

    @GetMapping("/memory")
    public String memoryGame() {
        return "memory";
    }

    @GetMapping("/spendquest")
    public String spendQuest() {
        return "map";
    }
}

