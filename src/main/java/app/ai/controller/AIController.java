package app.ai.controller;

import app.ai.model.AIRequest;
import app.ai.model.AIResponse;
import app.ai.service.AIService;
import app.security.UserData;
import app.user.model.User;
import app.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@Slf4j
@Controller
@RequestMapping("/ai")
public class AIController {

    private final AIService aiService;
    private final UserService userService;

    @Autowired
    public AIController(AIService aiService, UserService userService) {
        this.aiService = aiService;
        this.userService = userService;
    }

    // Show the AI chat page (GET request)
    @GetMapping("/chat")
    public String showChatPage() {
        return "ai-chat";  //
    }


    @PostMapping("/chat")
    public String chatWithAI(@AuthenticationPrincipal UserData userdata, @RequestParam("message") String message, Model model) {
        log.info("Received message: {}", message);


        User user = userService.getById(userdata.getUserId());


        AIRequest request = new AIRequest();
        AIResponse aiResponse = aiService.chatWithAI(request);

        log.info("AI response: {}", aiResponse);


        model.addAttribute("aiResponse", aiResponse);
        model.addAttribute("user", user);

        return "ai-chat";
    }
}
