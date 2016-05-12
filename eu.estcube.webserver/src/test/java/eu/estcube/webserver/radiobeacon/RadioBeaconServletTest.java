package eu.estcube.webserver.radiobeacon;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.camel.ProducerTemplate;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.hbird.exchange.core.EntityInstance;
import org.hbird.exchange.core.Parameter;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.codec.radiobeacon.RadioBeaconDateInputParser;
import eu.estcube.codec.radiobeacon.RadioBeaconTranslator;
import eu.estcube.common.Constants;

@RunWith(MockitoJUnitRunner.class)
public class RadioBeaconServletTest {

    @Mock
    HttpServletRequest request;

    @Mock
    HttpServletResponse response;

    @Mock
    PrintWriter writer;

    RadioBeaconServlet servlet;

    private String sampleLineNumber = "1";
    private long sampleDateL = 10L;
    private String sampleDate = "DATE";
    private String sampleData = "DATA";
    private String sampleIssuedBy = "aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_";
    private String invalidIssuedBy = "aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_X";
    private String sampleInsertedBy = "aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_";

    private String doPostSuccessResultJson = "{\"status\":\"ok\",\"message\":\"Data sent!\",\"lineNumber\":\""
            + sampleLineNumber + "\"}";

    HashMap<String, EntityInstance> parameters;

    @Before
    public void setup() throws Exception {
        servlet = spy(new RadioBeaconServlet());
        servlet.producer = mock(ProducerTemplate.class);
        servlet.translator = mock(RadioBeaconTranslator.class);
        servlet.parser = mock(RadioBeaconDateInputParser.class);

        when(request.getParameter("datetime")).thenReturn(sampleDate);
        when(request.getParameter("source")).thenReturn(sampleIssuedBy);
        when(request.getParameter("data")).thenReturn(sampleData);
        when(request.getParameter("lineNumber")).thenReturn(sampleLineNumber);

        when(servlet.parser.parse(sampleDate)).thenReturn(sampleDateL);

        when(response.getWriter()).thenReturn(writer);

        parameters = new HashMap<String, EntityInstance>();
        parameters.put("x", new Parameter("A", "b"));
        parameters.put("y", new Parameter("C", "d"));
    }

    @Test
    public void testGetIssuedByMaxLength() {
        assertEquals(Constants.DATABASE_BEACON_ISSUEDBY_LENGTH, servlet.getIssuedByMaxLength());
    }

    @Test
    public void testIsIssuedByLengthOk() {
        assertEquals(true, servlet.isIssuedByLengthOk(""));
        assertEquals(true, servlet.isIssuedByLengthOk(sampleIssuedBy));
        assertEquals(false, servlet.isIssuedByLengthOk(invalidIssuedBy));
    }

    @Test
    public void testAreParametersOk() {
        HashMap<String, EntityInstance> parameters = new HashMap<String, EntityInstance>();
        assertEquals(false, servlet.areParametersOk(parameters));

        parameters.put("x", new Parameter("A", "b"));
        assertEquals(true, servlet.areParametersOk(parameters));
    }

    @Test
    public void testGetErrorJson() throws JSONException {
        JSONObject json = servlet.getErrorJson("x");
        assertEquals("error", json.get("status"));
        assertEquals("x", json.get("message"));
        assertEquals("x", json.get("exceptionMessage"));
    }

    @Test
    public void testGetOkJson() throws JSONException {
        JSONObject json = servlet.getOkJson("x");
        assertEquals("ok", json.get("status"));
        assertEquals("x", json.get("message"));
    }

    @Test
    public void testSendEntityInstancesToAmq() {

        servlet.sendEntityInstancesToAmq(parameters);

        verify(servlet.producer, times(1)).sendBody(parameters.get("x"));
        verify(servlet.producer, times(1)).sendBody(parameters.get("y"));

    }

    @Test
    public void testExtractDateTimeFromRequest() {
        when(request.getParameter("datetime")).thenReturn(" 1234 ");
        assertEquals("1234", servlet.extractDateTimeFromRequest(request));
    }

    @Test
    public void testExtractSourceFromRequest() {
        when(request.getParameter("source")).thenReturn(" 1234 ");
        assertEquals("1234", servlet.extractSourceFromRequest(request));
    }

    @Test
    public void testExtractDataFromRequest() {
        when(request.getParameter("data")).thenReturn(" 1234 ");
        assertEquals("1234", servlet.extractDataFromRequest(request));
    }

    @Test
    public void testExtractLineNumberFromRequest() {
        when(request.getParameter("lineNumber")).thenReturn(" 1234 ");
        assertEquals("1234", servlet.extractLineNumberFromRequest(request));
    }

    @Test
    public void testExtractLineNumberFromRequest_noLineNumberGivenInRequest() {
        when(request.getParameter("lineNumber")).thenReturn(null);
        assertEquals(null, servlet.extractLineNumberFromRequest(request));
    }

    @Test
    public void testGetJson() throws Exception {

        when(
                servlet.translator.toParameters(sampleData, sampleDateL, sampleIssuedBy, 
                		sampleIssuedBy, servlet.getIdBuilder()))
                .thenReturn(
                        parameters);

        JSONObject result = servlet.getJson(sampleDate, sampleIssuedBy, sampleData, sampleInsertedBy);

        InOrder inOrder = inOrder(servlet, servlet.parser, servlet.translator);
        inOrder.verify(servlet, times(1)).isIssuedByLengthOk(sampleIssuedBy);
        inOrder.verify(servlet.parser, times(1)).parse(sampleDate);
        inOrder.verify(servlet.translator, times(1)).toParameters(sampleData, sampleDateL, sampleIssuedBy,
        		sampleInsertedBy, servlet.getIdBuilder());
       // inOrder.verify(servlet, times(1)).areParametersOk(parameters);
  //      inOrder.verify(servlet, times(1)).sendEntityInstancesToAmq(parameters);
 //       inOrder.verify(servlet, times(1)).getOkJson(anyString());
    }

    @Test
    public void testGetJsonIssuedByLegthNotOk() throws JSONException {
        JSONObject result = servlet.getJson(sampleDate, invalidIssuedBy, sampleData, sampleInsertedBy);
        verify(servlet, times(1)).getErrorJson(anyString());
        assertEquals("error", result.get("status"));
    }

    @Test
    public void testGetJsonTranslatorThrowsException() throws Exception {

        when(
                servlet.translator.toParameters(sampleData, sampleDateL, sampleIssuedBy, 
                		"a",servlet.getIdBuilder()))
                .thenThrow(
                        new Exception(""));

        JSONObject result = servlet.getJson(sampleDate, sampleIssuedBy, sampleData, sampleInsertedBy);
        assertEquals("error", result.get("status"));
        assertEquals("Possible errors: incorrect beacon length, invalid symbols, incorrect callsign", result.get("message"));
    }

    @Test
    public void testGetJsonParametersNotOk() throws Exception {

        when(
                servlet.translator.toParameters(sampleData, sampleDateL, sampleIssuedBy, "a",
                        servlet.getIdBuilder()))
                .thenReturn(
                        new HashMap<String, EntityInstance>());

        JSONObject result = servlet.getJson(sampleDate, sampleIssuedBy, sampleData, sampleInsertedBy);

        verify(servlet, times(1)).areParametersOk(new HashMap<String, EntityInstance>());
        assertEquals("error", result.get("status"));
    }

    @Test
    public void testDoPostSuccess() throws Exception {

        // when(
        // servlet.translator.toParameters(sampleData, sampleDateL,
        // sampleIssuedBy, sampleInsertedBy,
        // servlet.getIdBuilder()))
        // .thenReturn(
        // parameters);
        //
        // servlet.doPost(request, response);
        //
        // verify(servlet, times(1)).getJson(sampleDate, sampleIssuedBy,
        // sampleData, sampleInsertedBy);
        // verify(writer, times(1)).write(doPostSuccessResultJson);
    }

}
