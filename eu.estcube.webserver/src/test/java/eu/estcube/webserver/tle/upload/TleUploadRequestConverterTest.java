package eu.estcube.webserver.tle.upload;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyMap;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.constants.StandardArguments;
import org.hbird.exchange.core.Metadata;
import org.hbird.exchange.interfaces.IEntityInstance;
import org.hbird.exchange.navigation.TleOrbitalParameters;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.common.hbird.MetadataFactory;
import eu.estcube.webserver.domain.TleUploadRequest;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class TleUploadRequestConverterTest {

    public static final String SAT = "ESTCube-X";
    public static final String SOURCE = "inbox";
    public static final String UPLOADER = "User";
    public static final String LINE_1 = "1: 1 2 3";
    public static final String LINE_2 = "2: 4 5 6";
    public static final String TLE = " " + LINE_1 + " \n " + LINE_2 + " \n ";
    public static final long NOW = System.currentTimeMillis();

    @Mock
    private TleUploadRequest req;

    @Mock
    private MetadataFactory metadataFactory;

    @Mock
    private Metadata metadata;

    @Mock
    private IdBuilder idBuilder;

    @InjectMocks
    private TleUploadRequestConverter converter;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @SuppressWarnings("unchecked")
    @Before
    public void setUp() throws Exception {
        inOrder = inOrder(req, metadataFactory, idBuilder);
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getTimestamp()).thenReturn(NOW);
        when(req.getTleSource()).thenReturn(SOURCE);
        when(req.getTleText()).thenReturn(TLE);
        when(req.getUploader()).thenReturn(UPLOADER);
        when(metadataFactory.createMetadata(any(IEntityInstance.class), anyMap(), anyString())).thenReturn(metadata);
        when(idBuilder.buildID(SAT, TleUploadRequestConverter.PARAMTER_TLE)).thenReturn(
                SAT + "/" + TleUploadRequestConverter.PARAMTER_TLE);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestConverter#convert(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Test
    public void testConvert() {
        List<IEntityInstance> result = converter.convert(req);
        TleOrbitalParameters request = (TleOrbitalParameters) result.get(0);
        assertNotNull(request);
        assertEquals(NOW, request.getTimestamp());
        assertEquals(TleUploadRequestConverter.PARAMTER_TLE, request.getName());
        assertEquals(SAT + "/" + TleUploadRequestConverter.PARAMTER_TLE, request.getID());
        assertNull(request.getIssuedBy());
        assertEquals(SAT, request.getSatelliteID());
        assertEquals(LINE_1, request.getTleLine1());
        assertEquals(LINE_2, request.getTleLine2());
        assertEquals(TleOrbitalParameters.DESCRIPTION, request.getDescription());

        assertEquals(metadata, result.get(1));

        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verify(req, times(1)).getTleText();
        inOrder.verify(idBuilder, times(1)).buildID(SAT, TleUploadRequestConverter.PARAMTER_TLE);
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();

        ArgumentCaptor<TleOrbitalParameters> tleCaptor = ArgumentCaptor.forClass(TleOrbitalParameters.class);
        ArgumentCaptor<Map> dataCaptor = ArgumentCaptor.forClass(Map.class);

        inOrder.verify(metadataFactory, times(1))
                .createMetadata(tleCaptor.capture(), dataCaptor.capture(), anyString());

        assertEquals(request, tleCaptor.getValue());
        Map<String, Object> data = dataCaptor.getValue();
        assertNotNull(data);
        assertEquals(2, data.size());
        assertEquals(UPLOADER, data.get(StandardArguments.USERNAME));
        assertEquals(SOURCE, data.get(StandardArguments.SOURCE));

        inOrder.verifyNoMoreInteractions();
    }
}
