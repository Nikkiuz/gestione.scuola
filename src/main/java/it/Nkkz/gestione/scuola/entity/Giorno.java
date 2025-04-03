package it.Nkkz.gestione.scuola.entity;

import java.time.DayOfWeek;

public enum Giorno {
	LUNEDI(DayOfWeek.MONDAY),
	MARTEDI(DayOfWeek.TUESDAY),
	MERCOLEDI(DayOfWeek.WEDNESDAY),
	GIOVEDI(DayOfWeek.THURSDAY),
	VENERDI(DayOfWeek.FRIDAY);

	private final DayOfWeek dayOfWeek;

	Giorno(DayOfWeek dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}

	public DayOfWeek toDayOfWeek() {
		return dayOfWeek;
	}

	public static Giorno fromString(String giornoItaliano) {
		return Giorno.valueOf(giornoItaliano.toUpperCase());
	}
}
