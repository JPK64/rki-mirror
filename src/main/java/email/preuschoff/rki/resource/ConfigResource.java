package email.preuschoff.rki.resource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import io.vertx.core.json.JsonObject;

@Path("config")
public class ConfigResource {
	private String read(String fileName) throws IOException {
		var file = new File(fileName);
		try(var stream = new FileInputStream(file)) {
			var data = new byte[(int) file.length()];
			stream.read(data);
			return new String(data, "UTF-8");
		}
	}

	@GET
	@Path("{file}.json")
	@Produces("application/json")
	public JsonObject getJson(@PathParam("file") String file)
			throws IOException {
		return new JsonObject(read("./config/" + file + ".json"));
	}
}
