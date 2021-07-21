package email.preuschoff.rki.model;

import java.time.Instant;

public final class Incidence implements Comparable<Incidence> {
	public Instant timestamp;
	public double incidence;

	@Override
	public int compareTo(Incidence other) {
		return other.timestamp.compareTo(timestamp);
	}
}
