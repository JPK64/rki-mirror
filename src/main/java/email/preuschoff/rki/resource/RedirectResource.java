package email.preuschoff.rki.resource;

import java.net.URI;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;

@Path("redirect")
public class RedirectResource {
	private static final Config config = ConfigProvider.getConfig();
	public static final URI spreadsheetURI = config.getValue(
			"redirect.spreadsheet", URI.class);
	public static final URI githubURI = config.getValue("redirect.github",
			URI.class);
	public static final URI regulationsURI = config.getValue(
			"redirect.regulations", URI.class);

	@GET
	@Path("spreadsheet")
	public Response redirectSpreadsheet() throws InterruptedException {
		return Response.temporaryRedirect(spreadsheetURI).build();
	}

	@GET
	@Path("github")
	public Response redirectGitHub() throws InterruptedException {
		return Response.temporaryRedirect(githubURI).build();
	}

	@GET
	@Path("regulations")
	public Response redirectRegulations() throws InterruptedException {
		return Response.temporaryRedirect(regulationsURI).build();
	}
}
