package app.user.model;

import lombok.Getter;

@Getter
public enum Country {
    BULGARIA("Bulgaria", "BGN"),
    GERMANY("Germany", "EUR"),
    INDIA("India", "INR"),
    UK("United Kingdom", "GBP");


    private final String displayName;
    private final String currencyCode;

    Country(String displayName, String currencyCode) {
        this.displayName = displayName;
        this.currencyCode = currencyCode;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }
}
