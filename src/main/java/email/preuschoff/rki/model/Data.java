package email.preuschoff.rki.model;

import java.time.Instant;

public final class Data {
	public Instant lastUpdated;
	public History state = new History();
	public History district = new History();
}
