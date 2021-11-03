package io.github.lucasmc64.meetme.classes;

import java.util.ArrayList;

/**
 *
 * @author lucasmc64
 */

public abstract class Event {
    private String name;
    private String description;
    private String host;
    private ArrayList<String> guests;
    
    public Event(String name, String description, String host, ArrayList<String> guests) {
        this.name = name;
        this.description = description;
        this.host = host;
        this.guests = guests;
    }
    
    public abstract EventDate findDate(String date);

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the host
     */
    public String getHost() {
        return host;
    }

    /**
     * @param host the host to set
     */
    public void setHost(String host) {
        this.host = host;
    }

    /**
     * @return the guests
     */
    public ArrayList<String> getGuests() {
        return guests;
    }

    /**
     * @param guests the guests to set
     */
    public void setGuests(ArrayList<String> guests) {
        this.guests = guests;
    }
}
