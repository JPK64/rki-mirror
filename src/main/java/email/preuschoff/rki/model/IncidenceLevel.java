package email.preuschoff.rki.model;

public enum IncidenceLevel {
	L0(0, 0.0, 10.0, 8),
	L1(1, 10.0, 35.0),
	L2(2, 35.0, 50.0),
	L3(3, 50.0, 100.0),
	L4(4, 100.0, 5000.0);

	public final int level;
	public final double min;
	public final double max;
	public final int dayLimit;

	private IncidenceLevel(int level, double min, double max, int dayLimit) {
		this.level = level;
		this.min = min;
		this.max = max;
		this.dayLimit = dayLimit;
	}

	private IncidenceLevel(int level, double min, double max) {
		this(level, min, max, 3);
	}

	public IncidenceLevel getHigher() {
		return IncidenceLevel.values()[level + 1];
	}

	public IncidenceLevel getLower() {
		return IncidenceLevel.values()[level - 1];
	}
}
