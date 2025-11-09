package app.games.service;

import app.games.model.MemorySession;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MemoryService {

    private static final String[] CARDS = {"💰", "💎", "🪙", "📈", "💳", "💵", "🛍️", "🏦"};
    private final Map<String, MemorySession> sessions = new HashMap<>();

    public MemorySession startGame(String userId) {
        MemorySession session = new MemorySession();
        session.setDeck(shuffleDeck());
        sessions.put(userId, session);
        return session;
    }

    public MemorySession checkMatch(String userId, int index1, int index2) {
        MemorySession session = sessions.get(userId);
        session.incrementTries();

        String card1 = session.getDeck().get(index1);
        String card2 = session.getDeck().get(index2);

        if (card1.equals(card2)) {
            session.getMatched().add(card1);

            int reward = session.getTries() <= 12 ? 5 : 1;
            session.addCoins(reward);
        }

        return session;
    }

    public MemorySession getResults(String userId) {
        return sessions.get(userId);
    }

    private List<String> shuffleDeck() {
        List<String> deck = new ArrayList<>();
        for (String c : CARDS) {
            deck.add(c);
            deck.add(c);
        }
        Collections.shuffle(deck);
        return deck;
    }

    public int totalPairs() {
        return CARDS.length;
    }
}
