package cloud;

public class ResponseFound extends Throwable {
    public ResponseFound(String uri) { super(uri); }
}