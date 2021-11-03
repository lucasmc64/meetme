package io.github.lucasmc64.meetme.classes;

/**
 *
 * @author lucasmc64
 */

public class EventTimetable {
    private String from;
    private String to;
    
    public EventTimetable(String from, String to) {
        this.from = from;
        this.to = to;
    }

    /**
     * @return the from
     */
    public String getFrom() {
        return from;
    }

    /**
     * @param from the from to set
     */
    public void setFrom(String from) {
        this.from = from;
    }

    /**
     * @return the to
     */
    public String getTo() {
        return to;
    }

    /**
     * @param to the to to set
     */
    public void setTo(String to) {
        this.to = to;
    }
}
