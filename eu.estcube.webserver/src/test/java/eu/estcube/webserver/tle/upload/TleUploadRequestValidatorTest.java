package eu.estcube.webserver.tle.upload;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.webserver.domain.TleUploadRequest;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class TleUploadRequestValidatorTest {

    public static final String SAT = "ESTCube-X";
    public static final String USER = "Alfonso";
    public static final String SOURCE = "inbox";
    public static final String LINE_1 = "1: 1 2 3";
    public static final String LINE_2 = "2: 4 5 6";
    public static final String TLE = " " + LINE_1 + " \n " + LINE_2 + " \n ";
    public static final long NOW = System.currentTimeMillis();

    private TleUploadRequestValidator validator;

    @Mock
    private TleUploadRequest req;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        validator = new TleUploadRequestValidator();
        inOrder = inOrder(req);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateSatelliteNull() {
        when(req.getSatellite()).thenReturn(null);
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateSatelliteEmpty() {
        when(req.getSatellite()).thenReturn("");
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateSatelliteBlank() {
        when(req.getSatellite()).thenReturn(" ");
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateUploaderNull() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(null);
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateUploaderEmpty() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn("");
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateUploaderBlank() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(" ");
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateSourceNull() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(null);
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateSourceEmpty() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn("");
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateSourceBlank() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(" ");
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateTimestampNotSet() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(SOURCE);
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateTimestampNegative() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(SOURCE);
        when(req.getTimestamp()).thenReturn(new Long(-1));
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateTleTextNull() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(SOURCE);
        when(req.getTimestamp()).thenReturn(NOW);
        when(req.getTleText()).thenReturn(null);
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verify(req, times(1)).getTleText();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateTleTextEmpty() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(SOURCE);
        when(req.getTimestamp()).thenReturn(NOW);
        when(req.getTleText()).thenReturn("");
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verify(req, times(1)).getTleText();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateTleTextBlank() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(SOURCE);
        when(req.getTimestamp()).thenReturn(NOW);
        when(req.getTleText()).thenReturn(" ");
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verify(req, times(1)).getTleText();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateTleTextOneLineOnly() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(SOURCE);
        when(req.getTimestamp()).thenReturn(NOW);
        when(req.getTleText()).thenReturn(LINE_1);
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verify(req, times(1)).getTleText();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidateTleTextTooManyLines() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(SOURCE);
        when(req.getTimestamp()).thenReturn(NOW);
        when(req.getTleText()).thenReturn(TLE + TLE);
        try {
            validator.validate(req);
            fail("Exception expected");
        } catch (Exception e) {
            assertEquals(IllegalArgumentException.class, e.getClass());
        }
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verify(req, times(1)).getTleText();
        inOrder.verifyNoMoreInteractions();
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadRequestValidator#validate(eu.estcube.webserver.domain.TleUploadRequest)}
     * .
     */
    @Test
    public void testValidate() {
        when(req.getSatellite()).thenReturn(SAT);
        when(req.getUploader()).thenReturn(USER);
        when(req.getTleSource()).thenReturn(SOURCE);
        when(req.getTimestamp()).thenReturn(NOW);
        when(req.getTleText()).thenReturn(TLE);
        TleUploadRequest result = validator.validate(req);
        assertEquals(req, result);
        inOrder.verify(req, times(1)).getSatellite();
        inOrder.verify(req, times(1)).getUploader();
        inOrder.verify(req, times(1)).getTleSource();
        inOrder.verify(req, times(1)).getTimestamp();
        inOrder.verify(req, times(1)).getTleText();
        inOrder.verifyNoMoreInteractions();
    }
}
