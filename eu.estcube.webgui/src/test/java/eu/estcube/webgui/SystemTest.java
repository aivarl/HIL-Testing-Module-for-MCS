package eu.estcube.webgui;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import eu.estcube.eu.IntegrationTest;

@Category(IntegrationTest.class)
public class SystemTest {

    private WebDriver driver;
    private String baseUrl;
    private WebElement mapPage;
    private WebElement logPage;
    private WebElement systemPage;
    private WebElement recentErrors;
    private WebElement systemCommands;
    private List<WebElement> generalWidgets;

    @Before
    public void setUp() throws Exception {
        DesiredCapabilities capability = DesiredCapabilities.internetExplorer();
        capability.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS, true);
        driver = new InternetExplorerDriver(capability);
        baseUrl = "mcc.estcube.eu:9292";
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        driver.get(baseUrl + "/MCS/");
        driver.findElement(By.name("j_username")).clear();
        driver.findElement(By.name("j_username")).sendKeys("test.admin");
        driver.findElement(By.name("j_password")).clear();
        driver.findElement(By.name("j_password")).sendKeys("testadmin");
        driver.findElement(By.id("loginButton")).click();
        generalWidgets = driver.findElements(By.id("gerenalWidgets"));
    }

    @Test
    public void initMapPageTest() throws Exception {
        mapPage = generalWidgets.get(0).findElement(By.id("geographicMap"));
        mapPage.click();
        driver.findElement(By.id("OpenLayers.Geometry.Point_67")).click();
        driver.findElement(By.id("OpenLayers.Layer.Vector_58_svgRoot")).click();
    }

    @Test
    public void initLogPageTest() throws Exception {
        logPage = generalWidgets.get(0).findElement(By.id("recentLogs"));
        logPage.click();
    }

    @Test
    public void initSystemPageTest() throws Exception {
        systemPage = generalWidgets.get(0).findElement(By.id("systemInfotmation"));
        systemPage.click();
    }

    @Test
    public void initCommandsPageTest() throws Exception {
        systemCommands = generalWidgets.get(0).findElement(By.id("systemCommands"));
        systemCommands.click();
    }

    @Test
    public void initErrorPageTest() throws Exception {
        recentErrors = generalWidgets.get(0).findElement(By.id("recentErrors"));
        recentErrors.click();
    }

    @After
    public void tearDown() throws Exception {
        driver.quit();
    }

}
