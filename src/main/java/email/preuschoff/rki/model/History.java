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
		if(getDaysAbove(2) >= 3)
			level = level.getHigher();
		else if(getDaysBelow(2) >= 5)
			level = level.getLower();
		return level.level;
	}

	@JsonIgnore
	protected int getDaysAbove(int offset) {
		int result = 0;
		for(var incidence : data)
			if(offset-- > 0) {
				offset--;
				continue;
			} else if(incidence.incidence >= level.max)
				result++;
			else
				break;
		return result;
	}

	@JsonIgnore
	protected int getDaysBelow(int offset) {
		int result = 0;
		for(var incidence : data)
			if(offset > 0) {
				offset--;
				continue;
			} else if(incidence.incidence < level.min) {
				if(incidence.isWorkday())
					result++;
			} else
				break;
		return result;
	}

	public int getDays() {
		return getDaysAbove(0) - getDaysBelow(0);
	}
}
