package app.user.service;

import app.user.model.User;
import app.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserPointsService {

    private final UserRepository userRepository;

    public UserPointsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User addPoints(UUID userId, int points) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPoints(user.getPoints() + points);
        return userRepository.save(user);
    }

    public int getPoints(UUID userId) {
        return userRepository.findById(userId)
                .map(User::getPoints)
                .orElse(0);
    }
}
