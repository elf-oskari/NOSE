 <?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
xmlns="http://www.opengis.net/sld"
xmlns:ogc="http://www.opengis.net/ogc"
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>39120</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre"> <!-- Psuvv -->
<Fill>
<GraphicFill>
<Graphic>
<Mark>
<WellKnownName>shape://slash</WellKnownName>
<Stroke>
<CssParameter name="stroke">#F2CC00</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
</Stroke>
</Mark>
<Size>176</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
<!-- 32611 Pelto alue -->
<Rule>
<Name>32611</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32611</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32612</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#666666</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32612</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>33100</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#666666</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>33100</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32111</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#666666</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32111</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<OnlineResource
xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
xlink:href="maastokartta_250k/Phko.svg"/>
<Format>image/svg+xml</Format>
</ExternalGraphic>
<Size>
<ogc:Literal>7000</ogc:Literal>
</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32112 Hieno kivenn�ismaanottoalue reunaviiva -->
<Rule>
<Name>32112</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32112</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#666666</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32112</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32113</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#666666</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32113</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32300</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#666666</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32300</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<OnlineResource
xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
xlink:href="maastokartta_250k/Psoist_33_66_100_0.svg"/>
<Format>image/svg+xml</Format>
</ExternalGraphic>
<Size>
<ogc:Literal>300</ogc:Literal>
</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 32500 Louhos reunaviiva -->
<Rule>
<Name>32500</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32500</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#666666</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32500</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<OnlineResource
xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
xlink:href="maastokartta_250k/Pkivikko_0_0_0_60.svg"/> <!-- Pkivikko 0 0 0 60 -->
<Format>image/svg+xml</Format>
</ExternalGraphic>
<Size>
<ogc:Literal>1800</ogc:Literal>
</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
</FeatureTypeStyle>
<FeatureTypeStyle>
<!-- 34300 Hietikko alue ja rasteri -->
<Rule>
<Name>34300</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>34300</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<OnlineResource
xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
xlink:href="maastokartta_250k/Phko.svg"/> <!-- Phko 0 0 0 100 v�rill� -->
<Format>image/svg+xml</Format>
</ExternalGraphic>
<Size>
<ogc:Literal>7000</ogc:Literal>
</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
<!-- 34700 Kivikko rasteri -->
<Rule>
<Name>34700</Name>
<ogc:Filter>
<ogc:And>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>34700</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsGreaterThanOrEqualTo> <!-- pinta-alayleistys yli 5000 m2 piirret��n -->
<ogc:Function name="area">
<ogc:PropertyName>geom</ogc:PropertyName>
</ogc:Function>
<ogc:Literal>5000</ogc:Literal>
</ogc:PropertyIsGreaterThanOrEqualTo>
</ogc:And>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PolygonSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Fill>
<GraphicFill>
<Graphic>
<ExternalGraphic>
<OnlineResource
xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
xlink:href="maastokartta_250k/Pkivikko_0_0_0_100.svg"/>
<Format>image/svg+xml</Format>
</ExternalGraphic>
<Size>
<ogc:Literal>1800</ogc:Literal>
</Size>
</Graphic>
</GraphicFill>
</Fill>
</PolygonSymbolizer>
</Rule>
<!-- 40200 ERM taajama -->
<Rule>
<Name>40200</Name>
<ogc:Filter>
<ogc:And>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohderyhma</ogc:PropertyName>
<ogc:Literal>82</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>40200</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:And>
</ogc:Filter>
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
<ogc:Filter>
<ogc:And>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohderyhma</ogc:PropertyName>
<ogc:Literal>47</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>40200</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:And>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Graphic>
<Mark>
<WellKnownName>circle</WellKnownName>
<Fill>
<CssParameter name="fill">#ce41d9</CssParameter>
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
<ogc:Filter>
<ogc:And>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36316</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohderyhma</ogc:PropertyName>
<ogc:Literal>64</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:And>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0080FF</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36200</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0019ff</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36200</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36211</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0019ff</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36211</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36323</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0019ff</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36323</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:And>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36316</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohderyhma</ogc:PropertyName>
<ogc:Literal>64</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:And>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>44300</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#000000</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>44300</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32441</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#666666</CssParameter>
<CssParameter name="stroke-width">40</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32431</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#F23030</CssParameter>
<CssParameter name="stroke-width">150</CssParameter>
<CssParameter name="stroke-linecap">butt</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- 52120 korkeusk�yr� -->
<Rule>
<Name>52120</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>52100</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#c2824d</CssParameter>
<CssParameter name="stroke-width">10</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<Rule>
<Name>Suojelualueiden reunaviiva 250k maastokarttat</Name>
<Title>Suojelualueiden reunaviivat 250k maastokartta</Title>
<Abstract>Suojelualueita ovat 72200 Muu luonnonsuojelualue, 72201 Luonnonpuisto,72202 Kansallispuisto, 72700 Er�maa-alue,72800 Retkeilyalue</Abstract>
<ogc:Filter>
<ogc:Or>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>72700</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>72000</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>72200</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>72201</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>72202</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Or>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre"> <!-- draw the original geometry with a green outline -->
<Stroke>
<CssParameter name="stroke">#00b300</CssParameter>
<CssParameter name="stroke-width">60</CssParameter>
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
<ogc:Filter>
<ogc:And>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>62100</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohderyhma</ogc:PropertyName>
<ogc:Literal>29</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:And>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#cc00ff</CssParameter>
<CssParameter name="stroke-width">50</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- 39500 Mets�n raja -->
<Rule>
<Name>39500</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>39500</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#00B200</CssParameter>
<CssParameter name="stroke-width">80</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">1000 250</CssParameter>
<CssParameter name="stroke-offset">100</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- suoja-alue 62200 -->
<Rule>
<Name>62200</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>62200</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#cc00ff</CssParameter>
<CssParameter name="stroke-width">50</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">1000 250</CssParameter>
<CssParameter name="stroke-offset">200</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- virtavesi alle 5 m -->
<Rule>
<Name>36312</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36312</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0080FF</CssParameter>
<CssParameter name="stroke-width">20</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- virtavesi leveys 5-20 m -->
<Rule>
<Name>36314</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36314</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0080FF</CssParameter>
<CssParameter name="stroke-width">45</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- virtavesi leveys 20-50 m -->
<Rule>
<Name>36321</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36321</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0080FF</CssParameter>
<CssParameter name="stroke-width">70</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- virtavesi leveys 50-125 m -->
<Rule>
<Name>36322</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36322</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0080FF</CssParameter>
<CssParameter name="stroke-width">70</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- 36316 kanava viivamainen -->
<Rule>
<Name>36316</Name>
<ogc:Filter>
<ogc:And>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>36316</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohderyhma</ogc:PropertyName>
<ogc:Literal>19</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:And>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#0080FF</CssParameter>
<CssParameter name="stroke-width">70</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- vesitorni 45800 -->
<Rule>
<Name>45800</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>45800</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Graphic>
<Mark>
<WellKnownName>circle</WellKnownName>
<Fill>
<CssParameter name="fill">#000000</CssParameter>
</Fill>
</Mark>
<Size>200</Size>
</Graphic>
</PointSymbolizer>
</Rule>
<!-- kunnan raja 84113 -->
<Rule>
<Name>84113</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>84113</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#4d00ff</CssParameter>
<CssParameter name="stroke-width">50</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">500 125 50 125</CssParameter>
<CssParameter name="stroke-dashoffset">100</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- AVI maakunnan raja 84115, aluehallintoviraston raja 84112 -->
<Rule>
<Name>84112</Name>
<ogc:Filter>
<ogc:Or>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>84112</ogc:Literal>
</ogc:PropertyIsEqualTo>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>84115</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Or>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#4d00ff</CssParameter>
<CssParameter name="stroke-width">50</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">500 125 50 125 50 125</CssParameter>
<CssParameter name="stroke-dashoffset">100</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- valtakunnan raja 84111 -->
<Rule>
<Name>84111</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>84111</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#4d00ff</CssParameter>
<CssParameter name="stroke-width">80</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
<CssParameter name="stroke-dasharray">800 200 100 200</CssParameter>
<CssParameter name="stroke-dashoffset">200</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- aluemeren ulkoraja 82100 -->
<Rule>
<Name>82100</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>82100</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#4d00ff</CssParameter>
<CssParameter name="stroke-width">50</CssParameter>
<CssParameter name="stroke-dasharray">800 300</CssParameter>
<CssParameter name="stroke-dashoffset">100</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- rautatieliikennepaikka 14200 -->
<Rule>
<Name>14200</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>14200</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Graphic>
<Mark>
<WellKnownName>circle</WellKnownName>
<Fill>
<CssParameter name="fill">#000000</CssParameter>
</Fill>
</Mark>
<Size>200</Size>
</Graphic>
</PointSymbolizer>
</Rule>
<!-- 47. Aita tekoaines 44211 -->
<Rule>
<Name>44211</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>44211</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#000000</CssParameter>
<CssParameter name="stroke-width">10</CssParameter>
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
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>32442</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Geometry>
<ogc:Function name ="offset">
<ogc:PropertyName>geom</ogc:PropertyName>
<ogc:Literal>-20</ogc:Literal>
<ogc:Literal>0</ogc:Literal>
</ogc:Function>
</Geometry>
<Graphic>
<ExternalGraphic>
<OnlineResource
xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
xlink:href="maastokartta_250k/SLentokone.svg"/>
<Format>image/svg+xml</Format>
</ExternalGraphic>
<Size>
<ogc:Literal>880</ogc:Literal>
</Size>
</Graphic>
</PointSymbolizer>
</Rule>
<!-- 45500 tuulivoimala -->
<Rule>
<Name>45500</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>45500</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Geometry>
<ogc:Function name ="offset">
<ogc:PropertyName>geom</ogc:PropertyName>
<ogc:Literal>0</ogc:Literal>
<ogc:Literal>200</ogc:Literal>
</ogc:Function>
</Geometry>
<Graphic>
<ExternalGraphic>
<OnlineResource
xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
xlink:href="maastokartta_250k/Stvoimala.svg"/>
<Format>image/svg+xml</Format>
</ExternalGraphic>
<Size>
<ogc:Literal>635</ogc:Literal>
</Size>
</Graphic>
</PointSymbolizer>
</Rule>
<!-- S�hk�linja, suurj�nnite 22311 -->
<Rule>
<Name>22311</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>22311</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<LineSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Stroke>
<CssParameter name="stroke">#333333</CssParameter>
<CssParameter name="stroke-width">20</CssParameter>
<CssParameter name="stroke-linecap">round</CssParameter>
</Stroke>
</LineSymbolizer>
</Rule>
<!-- 16126 merimajakka -->
<Rule>
<Name>16126</Name>
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>kohdeluokk</ogc:PropertyName>
<ogc:Literal>16126</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
<MinScaleDenominator>90000</MinScaleDenominator>
<MaxScaleDenominator>180000</MaxScaleDenominator>
<PointSymbolizer uom="http://www.opengeospatial.org/se/units/metre">
<Geometry>
<ogc:Function name ="offset">
<ogc:PropertyName>geom</ogc:PropertyName>
<ogc:Literal>0</ogc:Literal>
<ogc:Literal>30</ogc:Literal>
</ogc:Function>
</Geometry>
<Graphic>
<ExternalGraphic>
<OnlineResource
xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple"
xlink:href="maastokartta_250k/Smaja.svg"/>
<Format>image/svg+xml</Format>
</ExternalGraphic>
<Size>
<ogc:Literal>465</ogc:Literal>
</Size>
</Graphic>
</PointSymbolizer>
</Rule>
</FeatureTypeStyle>
</UserStyle>
</NamedLayer>
</StyledLayerDescriptor>

