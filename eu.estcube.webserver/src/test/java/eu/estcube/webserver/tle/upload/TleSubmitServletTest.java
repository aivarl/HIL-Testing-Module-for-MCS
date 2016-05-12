package eu.estcube.webserver.tle.upload;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.hbird.business.api.IPublisher;
import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.common.json.ToJsonProcessor;
import eu.estcube.webserver.domain.UIResponse;
import eu.estcube.webserver.domain.UIResponse.Status;
import eu.estcube.webserver.domain.UserInfo;
import eu.estcube.webserver.utils.CamelSender;
import eu.estcube.webserver.utils.HttpResponseSupport;
import eu.estcube.webserver.utils.UserInfoSupport;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class TleSubmitServletTest {

    private static final String TLE_SOURCE = "interwebs";

    private static final String TLE_TEXT = "Line1\nLine2";

    private static final String USER = "Baul";

    private static final String SATELLITE = "ESTCube-1";

    @InjectMocks
    private TleSubmitServlet servlet;

    @Mock
    private CamelSender camel;

    @Mock
    private UIResponse uiResponse;

    @Mock
    private UserInfoSupport uis;

    @Mock
    private UserInfo userInfo;

    @Mock
    private HttpServletRequest req;

    @Mock
    private HttpSession session;

    @Mock
    private HttpServletResponse resp;

    @Mock
    private HttpResponseSupport responseSupport;

    @Mock
    private ToJsonProcessor toJson;

    @Mock
    private IPublisher publisher;

    @Mock
    private IdBuilder idBuilder;

    private Exception exception;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        exception = new Exception();
        inOrder = inOrder(camel, uiResponse, uis, userInfo, req, session, resp,
                responseSupport, toJson);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleSubmitServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)}
     * .
     */
    @Test
    public void testDoPost() throws Exception {
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_SOURCE)).thenReturn(TLE_SOURCE);
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_TEXT)).thenReturn(TLE_TEXT);
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_SATELLITE_ID)).thenReturn(SATELLITE);
        when(idBuilder.buildID(SATELLITE, "TLE")).thenReturn(SATELLITE + "/TLE");

        servlet.doPost(req, resp);

        ArgumentCaptor<TleOrbitalParameters> tleCaptor = ArgumentCaptor.forClass(TleOrbitalParameters.class);

        verify(publisher).publish(tleCaptor.capture());

        TleOrbitalParameters tle = tleCaptor.getValue();
        assertEquals(TLE_SOURCE, tle.getIssuedBy());
        assertEquals(TLE_TEXT, tle.getTleLine1() + "\n" + tle.getTleLine2());
        assertEquals(SATELLITE, tle.getSatelliteID());

        ArgumentCaptor<UIResponse> responseCaptor = ArgumentCaptor.forClass(UIResponse.class);

        verify(responseSupport).sendAsJson(any(HttpServletResponse.class), any(ToJsonProcessor.class),
                responseCaptor.capture());

        assertEquals(Status.OK, responseCaptor.getValue().getStatus());
    }

    @Test
    public void testDoPostWhenError() throws Exception {
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_SOURCE)).thenReturn(TLE_SOURCE);
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_TEXT)).thenReturn("Test");
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_SATELLITE_ID)).thenReturn(SATELLITE);
        when(idBuilder.buildID(SATELLITE, "TLE")).thenReturn(SATELLITE + "/TLE");

        servlet.doPost(req, resp);

        ArgumentCaptor<UIResponse> responseCaptor = ArgumentCaptor.forClass(UIResponse.class);

        verify(responseSupport).sendAsJson(any(HttpServletResponse.class), any(ToJsonProcessor.class),
                responseCaptor.capture());

        assertEquals(Status.ERROR, responseCaptor.getValue().getStatus());
    }

    @Test
    public void testDoPostWhenPublisherError() throws Exception {
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_SOURCE)).thenReturn(TLE_SOURCE);
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_TEXT)).thenReturn("Test");
        when(req.getParameter(TleSubmitServlet.POST_PARAMETER_TLE_SATELLITE_ID)).thenReturn(SATELLITE);
        when(idBuilder.buildID(SATELLITE, "TLE")).thenReturn(SATELLITE + "/TLE");
        when(publisher.publish(any(TleOrbitalParameters.class))).thenThrow(Exception.class);

        servlet.doPost(req, resp);

        ArgumentCaptor<UIResponse> responseCaptor = ArgumentCaptor.forClass(UIResponse.class);

        verify(responseSupport).sendAsJson(any(HttpServletResponse.class), any(ToJsonProcessor.class),
                responseCaptor.capture());

        assertEquals(Status.ERROR, responseCaptor.getValue().getStatus());
    }
}
