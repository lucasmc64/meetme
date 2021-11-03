package io.github.lucasmc64.meetme.classes;

/**
 *
 * @author lucasmc64
 */

public class Response {
    private boolean ok;
    private String message;
    private Object data;
    
    public Response() {
        this.ok = true;
        this.message = "";
        this.data = null;
    }

    /**
     * @param data the data to set
     */
    public Response(Object data) {
        this.ok = true;
        this.message = "";
        this.data = data;
    }
    
    /**
     * @param ok the ok to set
     * @param message the message to set
     */
    public Response(boolean ok, String message) {
        this.ok = ok;
        this.message = message;
        this.data = null;
    }
    
    /**
     * @param ok the ok to set
     * @param message the message to set
     * @param data the data to set
     */
    public Response(boolean ok, String message, Object data) {
        this.ok = ok;
        this.message = message;
        this.data = data;
    }

    /**
     * @return the data
     */
    public Object getData() {
        return data;
    }

    /**
     * @param data the data to set
     */
    public void setData(Object data) {
        this.data = data;
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the ok
     */
    public boolean isOk() {
        return ok;
    }

    /**
     * @param ok the ok to set
     */
    public void setOk(boolean ok) {
        this.ok = ok;
    }
}
