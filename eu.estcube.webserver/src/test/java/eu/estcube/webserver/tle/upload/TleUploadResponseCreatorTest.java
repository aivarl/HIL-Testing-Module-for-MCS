package eu.estcube.webserver.tle.upload;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.inOrder;

import java.util.List;

import org.hbird.exchange.core.EntityInstance;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import eu.estcube.webserver.domain.UIResponse;
import eu.estcube.webserver.domain.UIResponse.Status;

/**
 *
 */
@RunWith(MockitoJUnitRunner.class)
public class TleUploadResponseCreatorTest {

    private TleUploadResponseCreator creator;

    @Mock
    private List<EntityInstance> params;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        creator = new TleUploadResponseCreator();
        inOrder = inOrder(params);
    }

    /**
     * Test method for
     * {@link eu.estcube.webserver.tle.upload.TleUploadResponseCreator#create(org.hbird.exchange.navigation.TleOrbitalParameters)}
     * .
     */
    @Test
    public void testCreate() {
        UIResponse response = creator.create(params);
        assertNotNull(response);
        assertEquals(Status.OK, response.getStatus());
        assertEquals(params, response.getValue());
        inOrder.verifyNoMoreInteractions();
    }
}
