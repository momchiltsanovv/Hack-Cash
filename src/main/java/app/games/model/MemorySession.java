package app.games.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class MemorySession {

    private List<String> deck;
    private List<String> matched = new ArrayList<>();
    private int coins = 0;
    private int tries = 0;

    public void incrementTries() {
        this.tries++;
    }

    public void addCoins(int amount) {
        this.coins += amount;
    }

    public boolean isFinished(int totalPairs) {
        return matched.size() == totalPairs;
    }
}
