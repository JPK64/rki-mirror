package email.preuschoff.rki;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

import email.preuschoff.rki.resource.DataResource;
import email.preuschoff.rki.service.DataService;

import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;

@ApplicationScoped
public class App {
	private Thread dataThread;

	public void onStart(@Observes StartupEvent e) {
		DataResource.service = new DataService();
		dataThread = new Thread(DataResource.service);
		dataThread.start();
	}

	public void onStop(@Observes ShutdownEvent e) throws InterruptedException {
		DataResource.service.stop = true;
		dataThread.interrupt();
		dataThread.join();
	}
}
