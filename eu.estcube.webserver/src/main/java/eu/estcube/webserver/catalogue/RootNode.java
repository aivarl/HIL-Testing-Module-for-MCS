package eu.estcube.webserver.catalogue;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.hbird.business.api.ICatalogue;
import org.hbird.business.api.IDataAccess;
import org.hbird.business.api.IOrbitalDataAccess;
import org.hbird.business.api.exceptions.ArchiveException;
import org.hbird.exchange.core.Binary;
import org.hbird.exchange.core.Command;
import org.hbird.exchange.core.EntityInstance;
import org.hbird.exchange.core.Event;
import org.hbird.exchange.core.Metadata;
import org.hbird.exchange.core.Parameter;
import org.hbird.exchange.navigation.OrbitalState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// FIXME - 30.04.2013; kimmell - code conventions!
public class RootNode extends CatalogueQueryNode {
    private static final Logger LOG = LoggerFactory.getLogger(RootNode.class);
    private static final long CONTACT_RETRIEVAL_TIMESPAN = 1000 * 60 * 60 * 24;
    private ICatalogue m_catalogue;
    private IOrbitalDataAccess m_dao;
    private IDataAccess d_dao;

    public static String decodeID(String id) {
        return id.replaceAll("([^_]|^)_([^_]|$)", "$1/$2").replaceAll("_(_+)", "$1");
    }

    private Op m_op_satellite_list = new Op() {
        @Override
        public Object getResult(java.util.StringTokenizer st, Map<String, String[]> queryParams) {
            return m_catalogue.getSatellites();
        };
    };

    private Op m_op_satellite_query = new Op() {
        @Override
        public Object getResult(java.util.StringTokenizer st, Map<String, String[]> queryParams) {
            if (!st.hasMoreTokens())
                return null;

            return m_catalogue.getSatelliteByName(st.nextToken());
        };
    };

    private Op m_op_groundstation_list = new Op() {
        @Override
        public Object getResult(java.util.StringTokenizer st, Map<String, String[]> queryParams) {
            return m_catalogue.getGroundStations();
        };
    };

    private Op m_op_groundstation_query = new Op() {
        @Override
        public Object getResult(java.util.StringTokenizer st, Map<String, String[]> queryParams) {
            if (!st.hasMoreTokens())
                return null;

            return m_catalogue.getGroundStationByName(st.nextToken());
        };
    };

    private Op m_op_orbitalState_query = new Op() {
        @Override
        public Object getResult(StringTokenizer st, Map<String, String[]> queryParams) {
            if (!st.hasMoreTokens()) {
                return null;
            }
            long now = System.currentTimeMillis();
            long start = now - 1000L * 60 * 60;
            long end = now + 1000L * 60 * 60 * 2;
            String id = decodeID(st.nextToken());

            List<OrbitalState> result;
            try {
                result = m_dao.getOrbitalStatesFor(id, start, end);
                return result;
            } catch (Exception e) {
                LOG.error("Error while fetching orbital states", e);
            }

            return Collections.<OrbitalState> emptyList();
        }
    };

    private Op m_op_contactEvents_query = new Op() {
        public Object getResult(StringTokenizer st, Map<String, String[]> queryParams) {
            if (!st.hasMoreTokens()) {
                return null;
            }

            String gsID = decodeID(st.nextToken());

            List<EntityInstance> events = new ArrayList<EntityInstance>();
            boolean done = false;

            // show previous events for the specified time, 24 h right now
            long passedEvents = 1000L * 60 * 60 * 24;
            long start = System.currentTimeMillis() - passedEvents;
            long end = System.currentTimeMillis() + CONTACT_RETRIEVAL_TIMESPAN;

            try {
                events.addAll(m_dao.getLocationContactEventsForGroundStation(gsID, start, end));
            } catch (ArchiveException e) {
                LOG.error("Couldn't get the next LocationContactEvent", e);
            }

            // while (!done && start < end) {
            // try {
            // LocationContactEvent event =
            // m_dao.getNextLocationContactEventForGroundStation(gsID);
            // events.add(event);
            //
            // start = event.getStartTime() + 1;
            // } catch (NotFoundException e) {
            // done = true;
            // } catch (Exception e) {
            // LOG.error("Couldn't get the next LocationContactEvent", e);
            // done = true;
            // }
            // }
            return events;
        }
    };

    //
    private Op m_op_parameter_query = new AllInstancesOp() {
        @Override
        protected List<Parameter> queryByID(String id, long from, long to) throws ArchiveException {
            return d_dao.getById(id, from, to, Parameter.class);
        }

        @Override
        protected List<Parameter> queryAll() throws Exception {
            return d_dao.getAll(Parameter.class);
        }
    };

    public RootNode(ICatalogue catalogue, IOrbitalDataAccess o_dao, IDataAccess d_dao) {
        m_catalogue = catalogue;
        m_dao = o_dao;
        this.d_dao = d_dao;

        addOption("satellites", m_op_satellite_list);
        addOption("satellite", m_op_satellite_query);
        addOption("groundstations", m_op_groundstation_list);
        addOption("groundstation", m_op_groundstation_query);
        addOption("orbitalstates", m_op_orbitalState_query);
        addOption("contactevents", m_op_contactEvents_query);

        addOption("parameter", m_op_parameter_query);
        addOption("binary", new DefaultAllInstancesOp<Binary>(d_dao, Binary.class));
        addOption("command", new DefaultAllInstancesOp<Command>(d_dao, Command.class));
        addOption("event", new DefaultAllInstancesOp<Event>(d_dao, Event.class));
        addOption("metadata", new DefaultAllInstancesOp<Metadata>(d_dao, Metadata.class));
    };

}
