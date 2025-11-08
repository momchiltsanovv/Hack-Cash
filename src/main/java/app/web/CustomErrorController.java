package app.web;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ModelAndView handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());

            // Handle 404 Not Found errors
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                ModelAndView modelAndView = new ModelAndView();
                modelAndView.setViewName("not-found");
                return modelAndView;
            }

            // Handle 500 Internal Server Error
            if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                ModelAndView modelAndView = new ModelAndView();
                modelAndView.setViewName("internal-server-error");
                return modelAndView;
            }
        }

        // For all other errors, return null to use Spring Boot's default error handling
        return null;
    }
}

