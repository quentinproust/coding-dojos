package com.codingdojos.api.exception;

public class MachinException extends RuntimeException {

    private final String code;

    public MachinException(String code) {
        super();
        this.code = code;
    }
    public MachinException(String message, Throwable cause, String code) {
        super(message, cause);
        this.code = code;
    }
    public MachinException(String message, String code) {
        super(message);
        this.code = code;
    }
    public MachinException(Throwable cause, String code) {
        super(cause);
        this.code = code;
    }
}
