package email.preuschoff.rki.resource;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import email.preuschoff.rki.model.Data;
import email.preuschoff.rki.service.DataService;

@Path("")
public class DataResource {
	public static DataService service;

	@GET
	@Path("data")
	@Produces("application/json")
	public Data getData() throws InterruptedException {
		return service.getData();
	}
}
