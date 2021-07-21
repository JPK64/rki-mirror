package email.preuschoff.rki.model;

import java.util.TreeSet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public final class History {
	@JsonIgnore
	public IncidenceLevel level;
	public TreeSet<Incidence> data;

	@JsonProperty
	protected int getLevel() {
		if(getDaysAbove(2) >= level.dayLimit)
			level = level.getHigher();
		else if(getDaysBelow(2) >= 5)
			level = level.getLower();
		return level.level;
	}

	@JsonIgnore
	protected int getDaysAbove(int offset) {
		int result = 0;
		for(var incidence : data)
			if(offset-- > 0)
				offset--;
			else if(incidence.incidence >= level.max)
				result++;
			else
				break;
		return result;
	}

	@JsonIgnore
	protected int getDaysBelow(int offset) {
		int result = 0;
		for(var incidence : data)
			if(offset > 0)
				offset--;
			else if(incidence.incidence < level.min)
				result++;
			else
				break;
		return result;
	}

	public int getDays() {
		return getDaysAbove(0) - getDaysBelow(0);
	}
}
