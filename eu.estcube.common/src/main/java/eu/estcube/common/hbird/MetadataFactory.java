/** 
 *
 */
package eu.estcube.common.hbird;

import java.util.Map;

import org.hbird.business.api.IdBuilder;
import org.hbird.business.api.impl.DefaultIdBuilder;
import org.hbird.exchange.core.Metadata;
import org.hbird.exchange.interfaces.IEntityInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
public class MetadataFactory {

	@Autowired
	private IdBuilder idBuilder;

	public Metadata createMetadata(IEntityInstance entity,
			Map<String, Object> data, String issuedBy) {
		if (idBuilder == null) {
			idBuilder = new DefaultIdBuilder();
		}
		String id = idBuilder.buildID(entity.getID(),
				Metadata.class.getSimpleName());
		String name = String.format("%s %s", entity.getName(),
				Metadata.class.getSimpleName());
		Metadata meta = new Metadata(id, name);
		meta.setApplicableTo(entity.getInstanceID());
		meta.setMetadata(data);
		meta.setIssuedBy(issuedBy);
		return meta;
	}

	public Metadata createMetadata(String id, String name, String instanceid, Map<String, Object> data, String issuedBy) {
		if (idBuilder == null) {
			idBuilder = new DefaultIdBuilder();
		}
		String id2 = idBuilder.buildID(id,
				Metadata.class.getSimpleName());
		String name2 = String.format("%s %s", id,
				Metadata.class.getSimpleName());
		Metadata meta = new Metadata(id2, name2);
		meta.setApplicableTo(instanceid);
		meta.setMetadata(data);
		meta.setIssuedBy(issuedBy);
		return meta;
	}
}
