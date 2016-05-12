package eu.estcube.webserver.radiobeacon;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.core.EntityInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import eu.estcube.codec.radiobeacon.RadioBeaconDateInputParser;
import eu.estcube.codec.radiobeacon.RadioBeaconTranslator;
import eu.estcube.common.json.ToJsonProcessor;

@SuppressWarnings("serial")
@Component
public class RadioBeaconTranslationServlet extends HttpServlet {

    @Autowired
    private IdBuilder idBuilder;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException
    {

        ToJsonProcessor toJson = new ToJsonProcessor();

        String datetime = request.getParameter("datetime");
        String source = request.getParameter("source");
        String data = request.getParameter("data");
        String insertedBy = request.getParameter("insertedBy");

        RadioBeaconTranslator translator = new RadioBeaconTranslator();
        HashMap<String, EntityInstance> parameters = null;

        try {
            parameters = translator.toParameters(data, new RadioBeaconDateInputParser().parse(datetime), source,
                    "a", idBuilder);
            if (parameters.values().size() == 0) {
                response.getWriter()
                        .write(
                                toJson.process("Beacon message could not be parsed. Please check that your message is correct!"));
            } else {
                response.getWriter().write(toJson.process(parameters));
            }

        } catch (Exception e) {
            response.getWriter().write(
                    toJson.process("Error parsing message to parameters. Beacon message is probably invalid. Error: "
                            + e.getMessage()));
        }

    }
}