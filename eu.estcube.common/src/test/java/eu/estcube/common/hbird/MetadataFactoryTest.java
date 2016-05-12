/** 
 *
 */
package eu.estcube.common.hbird;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.util.Map;

import org.hbird.business.api.IdBuilder;
import org.hbird.exchange.core.EntityInstance;
import org.hbird.exchange.core.Metadata;
import org.hbird.exchange.interfaces.IEntityInstance;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

/**
 * 
 */
@RunWith(MockitoJUnitRunner.class)
public class MetadataFactoryTest {

    private static final String ID = "/ESTCUBE/Satellites/ESTCube-1/beacon/raw";
    private static final String NAME = "Normal Mode Beacon Message";
    private static final String META_ISSUER = "meta issuer";

    private IEntityInstance entityInstance;

    @Mock
    private Map<String, Object> data;

    @Mock
    private IdBuilder idBuilder;

    @InjectMocks
    private MetadataFactory factory;

    private InOrder inOrder;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        entityInstance = new EntityInstance(ID, NAME) {
            private static final long serialVersionUID = 5609191967812851132L;
        };
        inOrder = inOrder(data, idBuilder);
    }

    @Test
    public void testCreateMetadata() throws Exception {
        when(idBuilder.buildID(ID, Metadata.class.getSimpleName())).thenReturn(
                ID + "/" + Metadata.class.getSimpleName());
        Metadata meta = factory.createMetadata(entityInstance, data, META_ISSUER);
        assertNotNull(meta);
        assertEquals(ID + "/" + Metadata.class.getSimpleName(), meta.getID());
        assertEquals(NAME + " " + Metadata.class.getSimpleName(), meta.getName());
        assertEquals(META_ISSUER, meta.getIssuedBy());
        assertTrue(entityInstance.getInstanceID().startsWith(ID + ":"));
        assertEquals(entityInstance.getInstanceID(), meta.getApplicableTo());
        assertTrue(meta.getInstanceID().startsWith(ID + "/" + Metadata.class.getSimpleName() + ":"));
        assertEquals(data, meta.getMetadata());
        inOrder.verify(idBuilder, times(1)).buildID(ID, Metadata.class.getSimpleName());
        inOrder.verifyNoMoreInteractions();
    }
}
