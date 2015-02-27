<?undefined version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<NamedLayer>
<Name>mtk_maastokartta_250k</Name>
<UserStyle>
<Title>mtk_maastokartta_250k</Title>
<Abstract>sld </Abstract>
<FeatureTypeStyle> <!-- 250k maastokartta -->
<!-- 250k -->
<!-- 39120 varvikko vaalennettu-->
<Rule>
<Name>39120</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>39120</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre"> <!-- Psuvv -->
<Fill>
<GraphicFill>
<Graphic>
<Mark>
<WellKnownName>$</WellKnownName>
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
</Stroke>
</Mark>
<Size>$</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
<!-- 32611 Pelto alue -->
<Rule>
<Name>32611</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32611</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#ffd980</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32612 Puutarha reunaviiva -->
<Rule>
<Name>32612</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32612</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#ffd980</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32612 Puutarha alue -->
<Rule>
<Name>32612</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32612</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#ffd980</CssParameter>
</Fill>
</PolygonSymbolizer>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre"> <!-- Ppt -->
<Fill>
<GraphicFill>
<Graphic>
<Mark>
<WellKnownName>circle</WellKnownName>
<Fill>
<CssParameter name="fill">#00FF00</CssParameter>
</Fill>
<Stroke>
<CssParameter name="stroke">#ffd980</CssParameter>
<CssParameter name="stroke-width">80</CssParameter>
</Stroke>
</Mark>
<Size>125</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 33100 Urheilu ja virkistysalue reunaviiva -->
<Rule>
<Name>33100</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>33100</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#e6ff80</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 33100 Urheilu ja virkistysalue alue ja reunaviiva -->
<Rule>
<Name>33100</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>33100</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#e6ff80</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32111 Karkean kivenn�ismaanottoalue reunaviiva -->
<Rule>
<Name>32111</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32111</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#ffffd9</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32111 Karkean kivenn�ismaanottoalue alue -->
<Rule>
<Name>32111</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32111</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#ffffd9</CssParameter>
</Fill>
</PolygonSymbolizer>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre"> <!-- Phko 0 0 0 100 v�rill� -->
<Fill>
<GraphicFill>
<Graphic>
<ExternalGraphic>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="maastokartta_250k/Phko.svg"/></OnlineResource></ExternalGraphic>
<Format>image/svg+xml</Format>
</Graphic>
<Size>
<Literal>7000</Literal>
</Size>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32112 Hieno kivenn�ismaanottoalue reunaviiva -->
<Rule>
<Name>32112</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32112</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#e6cc80</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32112 Hieno kivenn�ismaanottoalue alue -->
<Rule>
<Name>32112</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32112</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#e6cc80</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32113 Elop. kivenn�ismaanottoalue reunaviiva -->
<Rule>
<Name>32113</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32113</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#cfb873</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32113 Elop. kivenn�ismaanottoalue alue -->
<Rule>
<Name>32113</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32113</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#cfb873</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32300 Kaatopaikka reunaviiva -->
<Rule>
<Name>32300</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32300</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#ffffd9</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32300 Kaatopaikka alue, rasteri -->
<Rule>
<Name>32300</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32300</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#ffffd9</CssParameter>
</Fill>
</PolygonSymbolizer>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre"> <!-- Psoist 33 66 100 0 v�rill� -->
<Fill>
<GraphicFill>
<Graphic>
<ExternalGraphic>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="maastokartta_250k/Psoist_33_66_100_0.svg"/></OnlineResource></ExternalGraphic>
<Format>image/svg+xml</Format>
</Graphic>
<Size>
<Literal>300</Literal>
</Size>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32500 Louhos reunaviiva -->
<Rule>
<Name>32500</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32500</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#ffffd9</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32500 Louhos alue, rasteri-->
<Rule>
<Name>32500</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32500</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#ffffd9</CssParameter>
</Fill>
</PolygonSymbolizer>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Fill>
<GraphicFill>
<Graphic>
<ExternalGraphic>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="maastokartta_250k/Pkivikko_0_0_0_60.svg"/></OnlineResource></ExternalGraphic> <!-- Pkivikko 0 0 0 60 -->
<Format>image/svg+xml</Format>
</Graphic>
<Size>
<Literal>1800</Literal>
</Size>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 34300 Hietikko alue ja rasteri -->
<Rule>
<Name>34300</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>34300</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#ffff66</CssParameter>
</Fill>
</PolygonSymbolizer>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Fill>
<GraphicFill>
<Graphic>
<ExternalGraphic>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="maastokartta_250k/Phko.svg"/></OnlineResource></ExternalGraphic> <!-- Phko 0 0 0 100 v�rill� -->
<Format>image/svg+xml</Format>
</Graphic>
<Size>
<Literal>7000</Literal>
</Size>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</Rule>
<!-- 34700 Kivikko rasteri -->
<Rule>
<Name>34700</Name>
<Filter>
<And>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>34700</Literal>
</PropertyIsEqualTo>
<PropertyIsGreaterThanOrEqualTo> <!-- pinta-alayleistys yli 5000 m2 piirret��n -->
<Function name="area">
<PropertyName>geom</PropertyName>
</Function>
<Literal>5000</Literal>
</PropertyIsGreaterThanOrEqualTo>
</And>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Fill>
<GraphicFill>
<Graphic>
<ExternalGraphic>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="maastokartta_250k/Pkivikko_0_0_0_100.svg"/></OnlineResource></ExternalGraphic>
<Format>image/svg+xml</Format>
</Graphic>
<Size>
<Literal>1800</Literal>
</Size>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</Rule>
<!-- 40200 ERM taajama -->
<Rule>
<Name>40200</Name>
<Filter>
<And>
<PropertyIsEqualTo>
<PropertyName>kohderyhma</PropertyName>
<Literal>82</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>40200</Literal>
</PropertyIsEqualTo>
</And>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#f2cef2</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
<!-- 40200 ERM taajama piste -->
<Rule>
<Name>40200</Name>
<Filter>
<And>
<PropertyIsEqualTo>
<PropertyName>kohderyhma</PropertyName>
<Literal>47</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>40200</Literal>
</PropertyIsEqualTo>
</And>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Graphic>
<Mark>
<WellKnownName>$</WellKnownName>
<Fill>
<CssParameter name="fill">$</CssParameter>
</Fill>
</Mark>
<Size>500</Size>
</Graphic>
</PointSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 36316 kanava reunaviiva -->
<Rule>
<Name>36316</Name>
<Filter>
<And>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36316</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohderyhma</PropertyName>
<Literal>64</Literal>
</PropertyIsEqualTo>
</And>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre"> <!-- t�ll� viivalla poistetaan karttalehtijaon aiheuttama viiva -->
<Stroke>
<CssParameter name="stroke">#80ffff</CssParameter>
<CssParameter name="stroke-width">30</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 36200 j�rvivesi reunaviiva -->
<Rule>
<Name>36200</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36200</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<!-- t�ll� viivalla poistetaan karttalehtijaon aiheuttama viiva -->
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#80ffff</CssParameter>
<CssParameter name="stroke-width">30</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 36200 j�rvivesi alue -->
<Rule>
<Name>36200</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36200</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#80ffff</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 36211 merivesi reunaviiva -->
<Rule>
<Name>36211</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36211</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<!-- t�ll� viivalla poistetaan karttalehtijaon aiheuttama viiva -->
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#80ffff</CssParameter>
<CssParameter name="stroke-width">30</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 36211 merivesi alue -->
<Rule>
<Name>36211</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36211</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#80ffff</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 36323 virtavesi yli 125 m reuna -->
<Rule>
<Name>36323</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36323</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<!-- t�ll� viivalla poistetaan karttalehtijaon aiheuttama viiva -->
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#80ffff</CssParameter>
<CssParameter name="stroke-width">30</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 36323 virtavesi yli 125 alue m-->
<Rule>
<Name>36323</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36323</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#80ffff</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 36316 kanava alue taytto -->
<Rule>
<Name>36316</Name>
<Filter>
<And>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36316</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohderyhma</PropertyName>
<Literal>64</Literal>
</PropertyIsEqualTo>
</And>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#80ffff</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 44300 allas -->
<Rule>
<Name>44300</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>44300</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<!-- t�ll� viivalla poistetaan karttalehtijaon aiheuttama viiva -->
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#80ffff</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 44300 allas -->
<Rule>
<Name>44300</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>44300</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#80ffff</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32441 lentoasema alueet ja reunviivat -->
<Rule>
<Name>32441 </Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32441</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
<PolygonSymbolizer>
<Fill>
<CssParameter name="fill">#ffff8c</CssParameter>
</Fill>
</PolygonSymbolizer>
</Rule>
<!-- 32431 lentoaseman kiitotie -->
<Rule>
<Name>32431</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32431</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">butt</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- 52120 korkeusk�yr� -->
<Rule>
<Name>52120</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>52100</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<Rule>
<Name>Suojelualueiden reunaviiva 250k maastokarttat</Name>
<Title>Suojelualueiden reunaviivat 250k maastokartta</Title>
<Abstract>Suojelualueita ovat 72200 Muu luonnonsuojelualue, 72201 Luonnonpuisto,72202 Kansallispuisto, 72700 Er�maa-alue,72800 Retkeilyalue</Abstract>
<Filter>
<Or>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>72700</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>72000</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>72200</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>72201</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>72202</Literal>
</PropertyIsEqualTo>
</Or>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre"> <!-- draw the original geometry with a green outline -->
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
</Stroke>
</LineSymbolizer>
<!-- draw the intersection of the original geometr and the offset geometry with a green ouline and a green fill -->
<!-- <PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Geometry>
<ogc:Function name ="difference">
<ogc:PropertyName>geom</ogc:PropertyName>
<ogc:Function name="intersection">
<ogc:Function name="intersection">
<ogc:Function name="intersection">
<ogc:Function name="offset">
<ogc:PropertyName>geom</ogc:PropertyName>
<ogc:Literal>-100</ogc:Literal>
<ogc:Literal>-100</ogc:Literal>
</ogc:Function>
<ogc:Function name="offset">
<ogc:PropertyName>geom</ogc:PropertyName>
<ogc:Literal>100</ogc:Literal>
<ogc:Literal>100</ogc:Literal>
</ogc:Function>
</ogc:Function>
<ogc:Function name="offset">
<ogc:PropertyName>geom</ogc:PropertyName>
<ogc:Literal>100</ogc:Literal>
<ogc:Literal>-100</ogc:Literal>
</ogc:Function>
</ogc:Function>
<ogc:Function name="offset">
<ogc:PropertyName>geom</ogc:PropertyName>
<ogc:Literal>-100</ogc:Literal>
<ogc:Literal>100</ogc:Literal>
</ogc:Function>
</ogc:Function>
</ogc:Function>
</Geometry> -->
<!-- green slash fill -->
<!-- <Fill>
<GraphicFill>
<Graphic>
<Mark>
<WellKnownName>shape://slash</WellKnownName>
<Stroke>
<CssParameter name="stroke">#00b300</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
</Stroke>
</Mark>
<Size>176</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer> -->
</Rule>
<!-- Ampuma-alue 62100 -->
<Rule>
<Name>62100</Name>
<Title>62100 Ampuma-alue</Title>
<Abstract>62100 Ampuma-alueen reunaviiva. vyohyke on maastokartta_250k_vyohykkeet sld:ssa</Abstract>
<Filter>
<And>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>62100</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohderyhma</PropertyName>
<Literal>29</Literal>
</PropertyIsEqualTo>
</And>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- 39500 Mets�n raja -->
<Rule>
<Name>39500</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>39500</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">1000 250</CssParameter>
<CssParameter name="stroke-offset">100</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- suoja-alue 62200 -->
<Rule>
<Name>62200</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>62200</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">1000 250</CssParameter>
<CssParameter name="stroke-offset">200</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- virtavesi alle 5 m -->
<Rule>
<Name>36312</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36312</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- virtavesi leveys 5-20 m -->
<Rule>
<Name>36314</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36314</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- virtavesi leveys 20-50 m -->
<Rule>
<Name>36321</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36321</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- virtavesi leveys 50-125 m -->
<Rule>
<Name>36322</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36322</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- 36316 kanava viivamainen -->
<Rule>
<Name>36316</Name>
<Filter>
<And>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>36316</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohderyhma</PropertyName>
<Literal>19</Literal>
</PropertyIsEqualTo>
</And>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- vesitorni 45800 -->
<Rule>
<Name>45800</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>45800</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Graphic>
<Mark>
<WellKnownName>$</WellKnownName>
<Fill>
<CssParameter name="fill">$</CssParameter>
</Fill>
</Mark>
<Size>200</Size>
</Graphic>
</PointSymbolizer>
</Rule>
<!-- kunnan raja 84113 -->
<Rule>
<Name>84113</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>84113</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">500 125 50 125</CssParameter>
<CssParameter name="stroke-dashoffset">100</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- AVI maakunnan raja 84115, aluehallintoviraston raja 84112 -->
<Rule>
<Name>84112</Name>
<Filter>
<Or>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>84112</Literal>
</PropertyIsEqualTo>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>84115</Literal>
</PropertyIsEqualTo>
</Or>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">500 125 50 125 50 125</CssParameter>
<CssParameter name="stroke-dashoffset">100</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- valtakunnan raja 84111 -->
<Rule>
<Name>84111</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>84111</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">800 200 100 200</CssParameter>
<CssParameter name="stroke-dashoffset">200</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- aluemeren ulkoraja 82100 -->
<Rule>
<Name>82100</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>82100</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-dasharray">800 300</CssParameter>
<CssParameter name="stroke-dashoffset">100</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- rautatieliikennepaikka 14200 -->
<Rule>
<Name>14200</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>14200</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Graphic>
<Mark>
<WellKnownName>$</WellKnownName>
<Fill>
<CssParameter name="fill">$</CssParameter>
</Fill>
</Mark>
<Size>200</Size>
</Graphic>
</PointSymbolizer>
</Rule>
<!-- 47. Aita tekoaines 44211 -->
<Rule>
<Name>44211</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>44211</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">square</CssParameter>
</Stroke>
</LineSymbolizer>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#000000</CssParameter>
<CssParameter name="stroke-width">110</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">2 300</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- Lentokentt�symboli 32442-->
<Rule>
<Name>32442</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>32442</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Geometry>
<Function name="offset">
<PropertyName>geom</PropertyName>
<Literal>-20</Literal>
<Literal>0</Literal>
</Function>
</Geometry>
<Graphic>
<ExternalGraphic>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="maastokartta_250k/SLentokone.svg"/></OnlineResource></ExternalGraphic>
<Format>image/svg+xml</Format>
</Graphic>
<Size>
<Literal>$</Literal>
</Size>
</PointSymbolizer>
</Rule>
</Rule>
<!-- 45500 tuulivoimala -->
<Rule>
<Name>45500</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>45500</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Geometry>
<Function name="offset">
<PropertyName>geom</PropertyName>
<Literal>0</Literal>
<Literal>200</Literal>
</Function>
</Geometry>
<Graphic>
<ExternalGraphic>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="maastokartta_250k/Stvoimala.svg"/></OnlineResource></ExternalGraphic>
<Format>image/svg+xml</Format>
</Graphic>
<Size>
<Literal>$</Literal>
</Size>
</PointSymbolizer>
</Rule>
</Rule>
<!-- S�hk�linja, suurj�nnite 22311 -->
<Rule>
<Name>22311</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>22311</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">$</CssParameter>
<CssParameter name="stroke-width">$</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- 16126 merimajakka -->
<Rule>
<Name>16126</Name>
<Filter>
<PropertyIsEqualTo>
<PropertyName>kohdeluokk</PropertyName>
<Literal>16126</Literal>
</PropertyIsEqualTo>
</Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Geometry>
<Function name="offset">
<PropertyName>geom</PropertyName>
<Literal>0</Literal>
<Literal>30</Literal>
</Function>
</Geometry>
<Graphic>
<ExternalGraphic>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="maastokartta_250k/Smaja.svg"/></OnlineResource></ExternalGraphic>
<Format>image/svg+xml</Format>
</Graphic>
<Size>
<Literal>$</Literal>
</Size>
</PointSymbolizer>
</Rule>
</Rule>
</FeatureTypeStyle>
</UserStyle>
</NamedLayer>
</StyledLayerDescriptor>

