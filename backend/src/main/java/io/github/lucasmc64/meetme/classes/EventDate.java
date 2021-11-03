package io.github.lucasmc64.meetme.classes;

import java.util.ArrayList;

/**
 *
 * @author lucasmc64
 */

public class EventDate {
    private String date;
    private ArrayList<EventTimetable> timetables;
    
    public EventDate(String date) {
        this.date = date;
        this.timetables = new ArrayList();
    }
    
    public EventDate(String date, ArrayList<EventTimetable> timetables) {
        this(date);
        
        this.timetables = timetables;
    }

    /**
     * @return the date
     */
    public String getDate() {
        return date;
    }

    /**
     * @param date the date to set
     */
    public void setDate(String date) {
        this.date = date;
    }

    /**
     * @return the timetables
     */
    public ArrayList<EventTimetable> getTimetables() {
        return timetables;
    }

    /**
     * @param timetables the timetables to set
     */
    public void setTimetables(ArrayList<EventTimetable> timetables) {
        this.timetables = timetables;
    }
}
